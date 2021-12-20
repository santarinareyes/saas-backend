import { AuthorizationType, GraphqlApi, Schema } from "@aws-cdk/aws-appsync"
import { CfnOutput, Duration, Expiration, Stack, StackProps } from "aws-cdk-lib"
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda"
import { Construct } from "constructs"
import { join } from "path"

export class SaasStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props)

    // Creates the AppSync API
    const api = new GraphqlApi(this, "Api", {
      name: "cdk-notes-appsync-api",
      schema: Schema.fromAsset("graphql/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: Expiration.after(Duration.days(365)),
          },
        },
      },
      xrayEnabled: true,
    })

    // Prints out the AppSync GraphQL endpoint to the terminal
    new CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl,
    })

    // Prints out the AppSync GraphQL API key to the terminal
    new CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || "",
    })

    // Prints out the stack region to the terminal
    new CfnOutput(this, "Stack Region", {
      value: this.region,
    })

    const helloLambda = new Function(this, "helloLambda", {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset(join(__dirname, "..", "services", "test")),
      handler: "hello.main",
    })
  }
}
