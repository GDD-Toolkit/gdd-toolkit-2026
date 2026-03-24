/**
 * Converts S3 URIs to HTTPS URLs for browser display
 * @param s3Uri - S3 URI in format s3://bucket-name/path/to/file.ext
 * @returns HTTPS URL or null if input is invalid
 * 
 * Note: Uses region-specific URL format (us-east-2) for better compatibility
 */
export function s3UriToHttps(s3Uri: string | undefined | null): string | null {
  if (!s3Uri || !s3Uri.startsWith("s3://")) return null;

  const withoutPrefix = s3Uri.replace("s3://", "");
  const [bucket, ...keyParts] = withoutPrefix.split("/");
  const key = keyParts.join("/");

  // Try region-specific URL first (us-east-2 based on Amplify config)
  // If this doesn't work, the bucket may need CloudFront or different permissions
  return `https://${bucket}.s3.us-east-2.amazonaws.com/${key}`;
}

