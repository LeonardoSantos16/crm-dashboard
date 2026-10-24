import type { ChannelPickerProps } from "@/types/opportunity";
import { BUTTON_STYLES } from "@/utils/buttonStyles";
import { CHANNEL_LABELS, FOLLOW_UP_CHANNELS } from "@/utils/labels";

export const ChannelPicker = ({ value, onChange }: ChannelPickerProps) => (
  <div role="group" aria-labelledby="follow-up-channel" className="flex flex-col gap-1">
    <span id="follow-up-channel" className="text-sm font-semibold">
      Como foi
    </span>
    <div className="flex flex-wrap gap-2">
      {FOLLOW_UP_CHANNELS.map((channel) => {
        const isPressed = value === channel;
        return (
          <button
            key={channel}
            type="button"
            aria-pressed={isPressed}
            onClick={() => onChange(isPressed ? null : channel)}
            className={`${BUTTON_STYLES.secondary} ${isPressed ? "border-forest bg-success-bg inset-ring inset-ring-forest" : ""}`}
          >
            {CHANNEL_LABELS[channel]}
          </button>
        );
      })}
    </div>
  </div>
);
