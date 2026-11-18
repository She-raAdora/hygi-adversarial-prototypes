export const voiceCloneCallout = {
  title: "Was my voice recorded—or cloned?",
  intro: "A recording is not proof that someone cloned your voice. A service may process speech without keeping the audio. If it does keep something, find out what:",
  kinds: [
    { term: "Audio recording", body: "A copy of what you sounded like." },
    { term: "Transcript", body: "A text version of what you said." },
    { term: "Voiceprint", body: "A digital pattern used to recognize or verify a speaker." },
    { term: "Voice clone", body: "Generated speech made to sound like you." },
  ],
  sections: [
    { heading: "If you’re worried a service recorded you", body: "Go directly to its official privacy settings or support page. Ask what it retained, why, for how long, and whether it used or shared the audio for AI training, voice identification, or voice generation. Ask what you can delete or opt out of. Turning off microphone access can reduce future collection; it does not delete audio already held. Don’t upload another sample to a site that promises to tell you whether you’ve been cloned." },
    { heading: "If someone is already impersonating you", body: "Save the voicemail or post details without reposting the audio. Warn the people being contacted through a separate, trusted channel and report the impersonation to the platform. If someone sent money, contact the bank or payment provider immediately using its official app or a known number." },
    { heading: "What helps most", body: "Limit unnecessary voice uploads and microphone access, but don’t assume you can prevent all copying once audio is public. If a familiar voice asks for money, secrets, or a sign-in code, end the call and call the person back on a number you already know. Don’t rely on whether the voice sounds real." },
  ],
  checklistNote: "The service questions above are a Hygi checklist. Not every service offers deletion or opt-out rights.",
  sources: [
    { title: "FTC: Scammers use AI to enhance their family emergency schemes", url: "https://consumer.ftc.gov/consumer-alerts/2023/03/scammers-use-ai-enhance-their-family-emergency-schemes", note: "Risk from short audio clips and the callback rule." },
    { title: "FTC: What To Do if You Were Scammed", url: "https://consumer.ftc.gov/articles/what-do-if-you-were-scammed", note: "Contacting your bank or payment provider." },
  ],
} as const;
