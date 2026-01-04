import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
    // Read the file from your data folder using Node.js
    const jsonDirectory = path.join(process.cwd(), 'data');
    const fileContents = await fs.readFile(jsonDirectory + '/stations.json', 'utf8');
    
    // Return the content as a proper API response
    return Response.json(JSON.parse(fileContents));
}