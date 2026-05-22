/** Default matches Keyra marketing site; override with `NEXT_PUBLIC_ELEVENLABS_AGENT_ID`. */
export const DEFAULT_ELEVENLABS_AGENT_ID = "agent_4401kbnjtddpfsc9b97n73asggc1";

export function resolveElevenLabsAgentId(): string {
  return (
    process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID?.trim() || DEFAULT_ELEVENLABS_AGENT_ID
  );
}
