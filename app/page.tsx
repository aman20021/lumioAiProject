import PromptInput from "@/components/PromptInput";

export default function Home() {
  return (
    <div className="flex  flex-col items-center justify-between p-24">
      <h1 style={{ textAlign: 'center' }}>Prompt Demo</h1>
        <PromptInput />
    </div>
  );
}
