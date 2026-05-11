import { env } from "$env/dynamic/private";
import { Resend } from "resend";

let resendClient: Resend | null = null;

function client(): Resend | null {
  if (!env.RESEND_API_KEY) return null;
  if (!resendClient) resendClient = new Resend(env.RESEND_API_KEY);
  return resendClient;
}

export type OrderConfirmationInput = {
  to: string;
  reference: string;
  type: "drop" | "pod";
  items: { name: string; label: string; qty: number; price: number }[];
  total: number;
  status_url: string;
};

const bank = {
  sortCode: env.BANK_SORT_CODE ?? "",
  accountNumber: env.BANK_ACCOUNT_NUMBER ?? "",
  accountName: env.BANK_ACCOUNT_NAME ?? "",
};

function money(n: number): string {
  return `£${n.toFixed(2)}`;
}

function renderText(input: OrderConfirmationInput): string {
  const lines: string[] = [
    `Thanks for ordering from CUCaTS!`,
    ``,
    `Reference: ${input.reference}`,
    ``,
    `Items:`,
    ...input.items.map(
      (i) => `  - ${i.name} (${i.label}) × ${i.qty} — ${money(i.qty * i.price)}`,
    ),
    ``,
    `Total: ${money(input.total)}`,
    ``,
    `Pay by bank transfer using these details:`,
    `  Account name:   ${bank.accountName}`,
    `  Sort code:      ${bank.sortCode}`,
    `  Account number: ${bank.accountNumber}`,
    `  Reference:      ${input.reference}`,
    ``,
    `Please use the reference exactly as shown — that's how we'll match your transfer.`,
    `Your order will be marked as paid once we receive it.`,
    ``,
  ];
  lines.push(`Track your order: ${input.status_url}`);
  lines.push(``);
  lines.push(`— CUCaTS committee`);
  return lines.join("\n");
}

export async function sendOrderConfirmation(input: OrderConfirmationInput) {
  const c = client();
  if (!c || !env.EMAIL_FROM) {
    console.warn("RESEND_API_KEY or EMAIL_FROM not set; skipping email send");
    return;
  }
  const text = renderText(input);
  await c.emails.send({
    from: env.EMAIL_FROM,
    to: input.to,
    subject: `Order ${input.reference} received`,
    text,
  });
}
