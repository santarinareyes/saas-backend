import { Stack, StackProps } from "aws-cdk-lib"
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda"
import { Construct } from "constructs"
import { join } from "path"
import * as appsync from "@aws-cdk/aws-appsync-alpha"
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb"
import { AccountRecovery, UserPool, UserPoolClient, VerificationEmailStyle } from "aws-cdk-lib/aws-cognito"

export class SaasStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props)

    const userPool = new UserPool(this, "saas-user-pool", {
      selfSignUpEnabled: true,
      accountRecovery: AccountRecovery.PHONE_AND_EMAIL,
      userVerification: {
        emailStyle: VerificationEmailStyle.CODE
      },
      autoVerify: {
        email: true
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true
        }
      }
    })

    const userPoolClient = new UserPoolClient(this, "UserPoolClient", {
      userPool
    })


    
  //   const api = new appsync.GraphqlApi(this, "Api", {
  //     name: "demo",
  //     schema: appsync.Schema.fromAsset(
  //       join(__dirname, "..", "graphql", "schema.graphql")
  //     ),
  //     authorizationConfig: {
  //       defaultAuthorization: {
  //         authorizationType: appsync.AuthorizationType.IAM,
  //       },
  //     },
  //     xrayEnabled: true,
  //   })

  //   const demoTable = new Table(this, "DemoTable", {
  //     partitionKey: {
  //       name: "id",
  //       type: AttributeType.STRING,
  //     },
  //   })

  //   const demoDS = api.addDynamoDbDataSource("demoDataSource", demoTable)

  //   // Resolver for the Query "getDemos" that scans the DynamoDb table and returns the entire list.
  //   demoDS.createResolver({
  //     typeName: "Query",
  //     fieldName: "getDemos",
  //     requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
  //     responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList(),
  //   })

  //   // Resolver for the Mutation "addDemo" that puts the item into the DynamoDb table.
  //   demoDS.createResolver({
  //     typeName: "Mutation",
  //     fieldName: "addDemo",
  //     requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(
  //       appsync.PrimaryKey.partition("id").auto(),
  //       appsync.Values.projecting("input")
  //     ),
  //     responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
  //   })

  //   const helloLambda = new Function(this, "helloLambda", {
  //     runtime: Runtime.NODEJS_14_X,
  //     code: Code.fromAsset(join(__dirname, "..", "services", "test")),
  //     handler: "hello.main",
  //   })
  // }
}
