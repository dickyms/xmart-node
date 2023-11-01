const { createClient } = require("redis");
const Transactions = require('../db.js');
const spring = require('../api/spring.js');

const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
const cacheKey = 'transactions';

const sendToSpringServer = async (body) => {
  try {
    const result = await spring.post('/transactions', body);
    return result.data
  } catch (error) {
    console.log(error);
  }
}

const root = {
    postTransaction: async (input) => {
      const add = new Transactions({
        qrcode: input.qrcode,
        barcode: input.barcode,
        price: input.price,
        quantity: input.quantity
      });
      const result = await add.save();
      const rebuildData = {
        qrcode : result.qrcode,
        barcode : result.barcode,
        mongoId : result._id,
        date : result.date,
        price: result.price,
        quantity: result.quantity
      }
      const responseSpring = await sendToSpringServer(rebuildData);
      if (!responseSpring) {
        console.log("error spring");
      }
      await client.connect();
      await client.del(cacheKey)
      await client.disconnect();
      return result;
    },
    getTransactions: async () => {
      try {
        await client.connect();
        const value = await client.get(cacheKey);
        if (value) {
          console.log('User data fetched from cache');
          const converted = JSON.parse(value);
          await client.disconnect();
          return converted;
        }
        const transactions = await Transactions.find();
        await client.set(cacheKey, JSON.stringify(transactions));
        await client.disconnect();
        return transactions;
      } catch (error) {
        throw new Error('Error fetching transactions', error);
      }
    }
  }

module.exports = root;