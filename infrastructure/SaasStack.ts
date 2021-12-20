import { AuthorizationType } from "@aws-cdk/aws-appsync"
import { Duration, Expiration, Stack, StackProps } from "aws-cdk-lib"
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda"
import { Construct } from "constructs"
import { join } from "path"
import * as appsync from "@aws-cdk/aws-appsync-alpha"
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb"
import {
  AccountRecovery,
  UserPool,
  UserPoolClient,
  VerificationEmailStyle,
} from "aws-cdk-lib/aws-cognito"
import { CfnGraphQLApi } from "aws-cdk-lib/aws-appsync"
import {
  AuthorizationType,
  FieldLogLevel,
  GraphqlApi,
  Schema,
} from "@aws-cdk/aws-appsync-alpha"

export class SaasStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props)

    const userPool = new UserPool(this, "saas-user-pool", {
      selfSignUpEnabled: true,
      accountRecovery: AccountRecovery.PHONE_AND_EMAIL,
      userVerification: {
        emailStyle: VerificationEmailStyle.CODE,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
    })

    const userPoolClient = new UserPoolClient(this, "UserPoolClient", {
      userPool,
    })

    const api = new GraphqlApi(this, "saas-api", {
      name: "saas-api",
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL,
      },
      schema: Schema.fromAsset("../graphql/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: Expiration.after(Duration.days(365)),
          },
        },
        additionalAuthorizationModes: [
          {
            authorizationType: AuthorizationType.USER_POOL,
            userPoolConfig: {
              userPool,
            },
          },
        ],
      },
    })
  }
}
