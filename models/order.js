class Order {
  constructor(id, items, totalAmount, date) {
    this.id = id;
    this.totalAmount = totalAmount;
    this.items = items;
    this.date = date;
  }
}

export default Order;
