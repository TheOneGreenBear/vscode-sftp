import { COMMAND_DOWNLOAD } from '../constants';
import { download } from '../fileHandlers';
import { uriFromfspath } from './shared';
import { checkFileCommand } from './abstract/createCommand';
import * as fs from 'fs';

export default checkFileCommand({
  id: COMMAND_DOWNLOAD,
  getFileTarget: uriFromfspath,

  async handleFile(ctx) {
    const maxRetries = 5;
    let attempt = 0;
    let success = false;

    console.log('Context object:', ctx); // Log the context object to inspect its properties

    while (attempt < maxRetries && !success) {
      try {
        await download(ctx, { ignore: null });

        // Verify the file size after download
        const localFilePath = ctx.target.localFsPath; // Adjust this based on the correct property
        const remoteFilePath = ctx.target.remoteFsPath; // Corrected property

        const localFileSize = fs.statSync(localFilePath).size;
        const remoteFileSize = await getRemoteFileSize(remoteFilePath); // Implement this function to get remote file size

        if (localFileSize === remoteFileSize) {
          success = true;
          console.log('File downloaded successfully'); // Log message added
          console.log(`File downloaded: ${localFilePath}`);
        } else {
          throw new Error('File size mismatch after download');
        }
      } catch (error) {
        attempt++;
        console.error(`Attempt ${attempt} failed: ${error.message}`);
        if (attempt >= maxRetries) {
          throw new Error('Failed to download file after multiple attempts');
        }
      }
    }
  },
});

// Implement this function to get the remote file size
async function getRemoteFileSize(remoteFilePath: string): Promise<number> {
  // Add logic to get the remote file size
  // This will depend on the remote file system and protocol (e.g., FTP, SFTP)
  // For example, using an FTP client library to get the file size
  // Return the file size in bytes
  return 0; // Placeholder, replace with actual implementation
}