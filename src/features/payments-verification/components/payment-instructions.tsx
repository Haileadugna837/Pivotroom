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
    <div className="mb-4 rounded-md border border-black/10 p-3 text-sm dark:border-white/15">
      <p className="font-medium">Bank transfer</p>
      <p className="text-black/70 dark:text-white/70">Account name: {BANK_ACCOUNT_NAME}</p>
      <p className="text-black/70 dark:text-white/70">Account number: {BANK_ACCOUNT_NUMBER}</p>
      {price != null && (
        <p className="mt-1 text-black/70 dark:text-white/70">
          Amount: {currency} {price}
        </p>
      )}
      <p className="mt-2 text-xs text-black/50 dark:text-white/50">
        After paying, submit your transaction details below for admin verification.
      </p>
    </div>
  );
}
