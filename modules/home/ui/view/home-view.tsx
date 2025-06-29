import { ChatSection } from "../sections/chat-section";

interface HomeViewProps {
  chatId?: string;
}

export const HomeView = ({ chatId }: HomeViewProps) => {
  return (
    <div>
      <ChatSection chatId={chatId} />
    </div>
  );
};
