import { VizuantSDK } from "../vizuant-sdk"

describe("VizuantSDK", () => {
  let sdk: VizuantSDK

  beforeEach(() => {
    sdk = new VizuantSDK({
      apiKey: "test-api-key",
      arSettings: {
        experienceType: "marker",
        enableGestures: true,
      },
    })
  })

  test("initializes without errors", () => {
    expect(() => sdk.initialize()).not.toThrow()
  })

  test("creates AR scene", () => {
    document.body.innerHTML = '<div id="ar-container"></div>'
    expect(() => sdk.createARScene("ar-container")).not.toThrow()
  })

  // Add more tests as needed
})

