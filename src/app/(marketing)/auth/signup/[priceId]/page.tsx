import SignUpForm from './SignUpForm';

type Props = {
  params: Promise<{ priceId: string }>;
};

export default async function SignUpPagePricing(props: Props) {
  const params = await props.params;
  const { priceId } = params;

  return (
    <main>
      <SignUpForm priceId={priceId} />
    </main>
  );
}
