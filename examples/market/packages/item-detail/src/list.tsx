import React from 'react';
import { Observable } from 'react-microfrontend';

const itemsObservable = new Observable('items');
class List extends React.Component {
  state = {
    itemsMap: {}
  }

  observer

  componentDidMount() {
      const observer = (item) => {
        const { itemsMap } = this.state;

        const actualItems = itemsMap[item.id] || [];

        const newItemsMap = {
          ...itemsMap,
          [item.id]: actualItems.concat(item)
        }
  
        this.setState({ itemsMap: newItemsMap })
      };

      this.observer = observer;
  
      itemsObservable.subscribe(observer, { latest: true });
  }

  componentWillUnmount() {
    if (this.observer) {
      itemsObservable.unsubscribe(this.observer);
    }
  }

  render() {
    const { itemsMap: itemsMap } = this.state;

    const itemsKeys = Object.keys(itemsMap);
  
    if (!itemsKeys.length) {
      return (
        <div> Seu carrinho está vazio :( </div>
      )
    }
  
    return (
      <ul style={{ listStyle: 'none', color: 'white' }}>
        {
          itemsKeys.map((key) => {
            const items = itemsMap[key];
            const { id, name, price } = items[0];
  
            return (
            <li key={id} style={{ border: 'solid 2px yellow', margin: '1rem' }}>
              <p>{name} <span>{price}</span> <span> Qtde: <b>{items.length}</b> </span></p>
            </li>
          )})
        }
      </ul>
    );
  }
}

export default List;
