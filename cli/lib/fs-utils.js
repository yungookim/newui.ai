function createDryRunFs(fs, io) {
  return {
    ...fs,
    writeFileSync(targetPath) {
      io.log(`[dry-run] write ${targetPath}`);
    },
    unlinkSync(targetPath) {
      io.log(`[dry-run] delete ${targetPath}`);
    },
  };
}

module.exports = { createDryRunFs };
