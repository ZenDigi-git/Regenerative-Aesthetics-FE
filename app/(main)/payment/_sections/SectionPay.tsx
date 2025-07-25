'use client';

import React from 'react';
import OrderSummary from '../OrderSummary';
import ButtonOutline from '@/app/components/ButtonOutline';
import { useCart } from '@/lib/stores/cart';
import { toast } from 'sonner';
import { useCheckout } from '@/lib/hooks/cart/use-checkout';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { useGuestCheckout } from '@/lib/hooks/cart/use-guest-checkout';

const SectionPay = () => {
  const guestAddress = useCart(state => state.address);
  const address = useCart(state => state.selectedAddress);
  const selectedAddress = useCart(state => state.selectedAddress);
  const clearCart = useCart(state => state.clearCart);
  const router = useRouter(); // Use useRouter for navigation

  const { items: products } = useCart(state => state.cart);
  const { mutate: checkout, isPending: pendingCheckout } = useCheckout();
  const { mutate: guestCheckout, isPending: pendingGuestCheckout } =
    useGuestCheckout();

  const handleGuestCheckout = () => {
    if (!guestAddress) return toast.error('Please provide a delivery address!');

    guestCheckout(
      {
        shippingAddress: guestAddress,
        products: products.map(item => ({
          id: item.id,
          product_quantity: item.quantity,
        })),
        customerEmail: guestAddress.email || '',
        customerName: guestAddress.name,
        customerPhone: guestAddress.phone,
      },
      {
        onSuccess: () => {
          toast.success('Guest order placed successfully!');
          clearCart();
          router.replace('/products');
        },
        onError: () => toast.error('Failed to place order!'),
      }
    );
  };

  const handleCheckout = () => {
    if (products.length < 0) return toast.error('Your cart is empty!');

    if (!getUser()) return handleGuestCheckout();

    if (!selectedAddress && !address)
      return toast.error('Please select a delivery address!');

    if (selectedAddress)
      checkout(
        {
          ...selectedAddress,
        },
        {
          onSuccess: () => {
            toast.success('Order placed successfully!');
            router.replace('/profile');
          },
          onError: () => toast.error('Failed to place order!'),
        }
      );
  };

  return (
    <section className='grid grid-cols-2 gap-x-10 px-20 py-28'>
      <OrderSummary />
      <div>
        <h2 className='text-3xl mb-5'>Payment</h2>

        <p>
          Prefer to pay only when your order arrives? No problem! With our Cash
          on Delivery option, you can shop confidently and pay in cash when your
          order is delivered to your doorstep.
        </p>
        <p>How it works:</p>

        <ul>
          <li>Select Cash on Delivery at checkout.</li>

          <li>Confirm your shipping details and complete the order.</li>

          <li>
            Pay the total amount in cash to the delivery agent upon receiving
            your package.
          </li>

          <li></li>
        </ul>

        <p>Please Note:</p>
        <ul>
          <li>
            Kindly prepare the exact amount as our delivery personnel may not
            carry change.
          </li>
          <li>A small service fee is applicable for COD orders.</li>
        </ul>

        <ButtonOutline
          className='flex-1 bg-primary-variant2 text-white mt-5'
          onClick={handleCheckout}
          disabled={pendingCheckout || pendingGuestCheckout}
        >
          {pendingCheckout || pendingGuestCheckout
            ? 'Processing...'
            : 'Confirm Order'}
        </ButtonOutline>
      </div>
    </section>
  );
};

export default SectionPay;
