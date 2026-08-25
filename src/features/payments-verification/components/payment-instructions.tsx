const BANK_ACCOUNT_NAME = "Modern Ethiopia Marketing PLC";
const BANK_ACCOUNT_NUMBER = "1000578665424";

export function PaymentInstructions({
  price,
  currency,
}: {
  price: number | null;
  currency: string;
}) {
  return (
    <div className="mb-4 rounded-md border border-pivot-line p-3 text-sm text-pivot-ink">
      <p className="font-medium">Bank transfer</p>
      <p className="text-pivot-ink-2">Account name: {BANK_ACCOUNT_NAME}</p>
      <p className="text-pivot-ink-2">Account number: {BANK_ACCOUNT_NUMBER}</p>
      {price != null && <p className="mt-1 text-pivot-ink-2">Amount: {currency} {price}</p>}
      <p className="mt-2 text-xs text-pivot-muted">
        After paying, submit your transaction details below for admin verification.
      </p>
    </div>
  );
}
