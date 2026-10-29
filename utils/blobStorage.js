const { ContainerClient } = require("@azure/storage-blob");

const sasUrl = process.env.AZURE_BLOB_SAS_URL?.trim().replace(/^["']|["']$/g, "");

if (!sasUrl) {
    throw new Error("AZURE_BLOB_SAS_URL is required.");
}

const containerUrl = new URL(sasUrl);
const signature = containerUrl.searchParams.get("sig");

if (!signature || signature.length < 40 || /\s/.test(signature)) {
    throw new Error(
        "AZURE_BLOB_SAS_URL has an invalid SAS signature. Generate a new container SAS URL with Create and Write permissions and copy the full URL without editing it."
    );
}

const containerClient = new ContainerClient(sasUrl);
const containerPath = containerUrl.pathname.replace(/\/+$/, "");

const uploadToBlob = async (file, folderName) => {
    const blobName = `${folderName}/${Date.now()}-${file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: {
            blobContentType: file.mimetype,
        },
    });

    return blockBlobClient.url;
};

const deleteFromBlob = async (imageUrl) => {
    const parsedImageUrl = new URL(imageUrl);
    if (
        parsedImageUrl.host !== containerUrl.host ||
        !parsedImageUrl.pathname.startsWith(`${containerPath}/`)
    ) {
        throw new Error("Image URL does not belong to the configured blob container.");
    }

    const blobName = decodeURIComponent(
        parsedImageUrl.pathname.slice(containerPath.length + 1)
    );
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.deleteIfExists();
};

const isOwnBlobUrl = (url) => {
    if (!url) return false;

    try {
        const parsedUrl = new URL(url);
        return (
            parsedUrl.host === containerUrl.host &&
            parsedUrl.pathname.startsWith(`${containerPath}/`)
        );
    } catch {
        return false;
    }
};

module.exports = {
    uploadToBlob,
    deleteFromBlob,
    isOwnBlobUrl,
};