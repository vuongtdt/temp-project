import { FC } from "react";
import Picker from '@emoji-mart/react'

interface EmojiPickerProps {
  onEmojiSelect: (emoji: any) => void;
}

const EmojiPicker: FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  return (
    <Picker
      set="facebook"
      enableFrequentEmojiSort
      onEmojiSelect={onEmojiSelect}
      theme="dark"
      showPreview={false}
      showSkinTones={false}
      emojiTooltip
      defaultSkin={1}
      color="#0F8FF3"
    />
  );
};

export default EmojiPicker;
