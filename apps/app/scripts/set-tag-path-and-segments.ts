
import prisma from '@repo/database';

async function main() {
  const tags = await prisma.tag.findMany({
    where: {
      firstPath: ''
    },
  });
  for (const tag of tags) {
    const tagSegments = tag.name.split('/');
    const firstPath = tagSegments[0];
    // pathSegments: Array of tag path segments, e.g., for tag "a/b/c" it contains["a", "a/b", "a/b/c"]
    const pathSegments = tagSegments.map((segment, index) => {
      return tagSegments.slice(0, index + 1).join('/');
    });
    await prisma.tag.update({
      where: { id: tag.id },
      data: { firstPath, pathSegments },
    });
  }
}

main();
