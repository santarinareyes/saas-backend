import { SaasStack } from "./SaasStack"
import { App } from "aws-cdk-lib"

const app = new App()
new SaasStack(app, "SaasStack", {
  stackName: "SaasStack",
})
