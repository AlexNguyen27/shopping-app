import moment from 'moment';

class Order {
  constructor(id, items, totalAmount, date) {
    this.id = id;
    this.totalAmount = totalAmount;
    this.items = items;
    this.date = date;
  }

  get readableDate() {
    // return this.date.toLocaleDateString('en-US');
    return moment(this.date).format('LLLL');
  }
}

export default Order;
