import { FormKitNode } from '@formkit/core';

export default function contact(node: FormKitNode) {
  const { contactName, contactPosition, contactEmail } = node.parent?.value as any;
  if ((contactName && contactPosition && contactEmail) || (!contactName && !contactPosition && !contactEmail)) {
    return true;
  } else {
    return false;
  }
}
