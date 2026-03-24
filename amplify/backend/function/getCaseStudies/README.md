# getCaseStudies Lambda Function

This Lambda function retrieves all case studies from the DynamoDB table `Toolkit-CaseStudyProjects`.

## Environment Variables

- `CASE_STUDY_TABLE`: The name of the DynamoDB table (set to `Toolkit-CaseStudyProjects`)

## Dependencies

- `@aws-sdk/client-dynamodb`: AWS SDK v3 DynamoDB client
- `@aws-sdk/lib-dynamodb`: AWS SDK v3 DynamoDB Document Client utilities

## Notes

- This function uses ES modules (`"type": "module"` in package.json)
- If Amplify generates the function with CommonJS, you may need to:
  1. Change `import` statements to `require()`
  2. Change `export const handler` to `exports.handler`
  3. Remove `"type": "module"` from package.json

## Setting Environment Variables in Amplify

If `function-parameters.json` doesn't work, set environment variables via:

```bash
amplify update function
```

Then select:
- `getCaseStudies`
- `Environment variables configuration`
- Add `CASE_STUDY_TABLE` with value `Toolkit-CaseStudyProjects`

