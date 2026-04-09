//X00224599
import { voucherDataAccess } from '$lib/server/data-access/voucher-data-access.js';
import { sendVoucherEmail } from '$lib/server/email/voucher-email-service.js';
import crypto from 'crypto';

const VALID_AMOUNTS = [1000, 2000, 5000]; // €10, €20, €50 in cents

// Generates a unique code like RTE-xxx-xxxx
function generateCode() {
  const part1 = crypto.randomBytes(2).toString('hex').toUpperCase();
  const part2 = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `READY-${part1}-${part2}`;
}

export const voucherService = {

  // Purchase a voucher, saves to DB and sends email 
  async purchaseVoucher({ recipientName, recipientEmail, senderName, amount, message }) {

    if (!VALID_AMOUNTS.includes(amount)) {
      throw new Error('Invalid voucher amount. Choose €10, €20, or €50.');
    }
    if (!recipientName?.trim() || !recipientEmail?.trim() || !senderName?.trim()) {
      throw new Error('Please fill in all required fields.');
    }

    const code = generateCode();

    const voucher = await voucherDataAccess.create({
      code,
      amount,
      recipientName: recipientName.trim(),
      recipientEmail: recipientEmail.trim(),
      senderName: senderName.trim(),
      message: message?.trim() || null,
      redeemed: false,
      createdAt: new Date()
    });

    sendVoucherEmail({ voucher }).catch(err => {
      console.error('Voucher created but email failed to send:', err);
    });

    return voucher;
  },

  async getAllVouchers() {
    return voucherDataAccess.findAll();
  }

};