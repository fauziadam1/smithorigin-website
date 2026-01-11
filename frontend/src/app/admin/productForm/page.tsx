import { Suspense } from 'react';
import ProductForm from './productForm';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <ProductForm />
    </Suspense>
  );
}
