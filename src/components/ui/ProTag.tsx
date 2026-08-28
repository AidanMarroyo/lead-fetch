export function ProTag({ plan }: { plan: string | null }) {
  return (
    <span
      className={`ml-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-black shadow-sm ${
        plan === 'pro'
          ? 'bg-yellow-200 text-yellow-800 '
          : plan === 'unlimited'
            ? 'bg-purple-100 text-purple-700'
            : ''
      }`}
    >
      {plan === 'pro' && 'Pro'} {plan === 'unlimited' && 'Unlimited'}
    </span>
  );
}
