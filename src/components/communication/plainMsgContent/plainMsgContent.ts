import { makeBooleanProp, makeRequiredProp } from "@/utils/props";
import type { PropType } from "vue";
import type { PlainMessageContent } from "@/business/communication/message";

export const plainMsgContentProps = {
  content: {
    type: String as PropType<PlainMessageContent>,
    required: true,
  },
  byMe: makeBooleanProp(false),
};

export const plainMsgContentEmits = {
  // optional click or longpress events can be added later
};
