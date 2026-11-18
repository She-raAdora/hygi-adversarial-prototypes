export const backupRestorePractice = {
  title: "Can I get one file back?",
  intro: "A backup is useful only if you can get your files back. Practice with one non-sensitive file on a device that’s working normally. You don’t need to delete anything to test your backup.",
  steps: [
    { title: "Pick a test file.", body: "Choose a non-sensitive photo or document that’s already in your backup. If you create a test file, wait until your backup tool shows it was backed up." },
    { title: "Find it in your backup.", body: "Open the backup tool you already use. If you only see the current file in a synced folder, check whether your service offers version history or recovery. Seeing the current copy doesn’t tell you whether an older or deleted copy can be recovered." },
    { title: "Restore it somewhere separate.", body: "Use the tool’s option to restore to a different folder or save a copy under a different name. If it only offers to overwrite the original, stop and check the provider’s official instructions." },
    { title: "Open the restored copy.", body: "Check that it’s the file you expected and that it still opens. If you used an external backup drive, safely eject and disconnect it when you’re done." },
  ],
  outcomes: {
    worked: { label: "It worked", body: "You verified that this file could be restored. That’s a useful check, not proof that every file is backed up." },
    retry: { label: "I couldn’t find or open the copy", body: "Leave the original alone. Check which folders your backup covers and when it last ran, then retry using your provider’s official instructions." },
  },
  warning: "This is practice, not incident response. If you suspect ransomware or malware, don’t connect your backup drive to that device.",
  source: { title: "#StopRansomware Guide", url: "https://www.cisa.gov/stopransomware/ransomware-guide" },
};