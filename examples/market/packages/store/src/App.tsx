import React from 'react';
import { Observable } from 'react-microfrontend';

declare global {
  interface Window { observable: any }
}

const ITEMS = [
  {
    id: 'coke',
    name: 'Coca',
    price: 5
  },
  {
    id: 'potato',
    name: 'Batata frita',
    price: 10
  },
  {
    id: 'cake',
    name: 'Bolo',
    price: 15
  },
  {
    id: 'pasta',
    name: 'Macarronada',
    price: 12
  },
  {
    id: 'hamburger',
    name: 'Hamburger',
    price: 20
  },
];

const itemObservable = new Observable('items');

window.observable = itemObservable
const handleItemClick = (item: any) => {
  console.log('Clicou hein')
  itemObservable.dispatch(item);
}

const App: React.FC = () => {
  const items = ITEMS;
  
  return (
    <section style={{ backgroundColor: 'black', color: 'white' }}>
      <ul style={{ listStyle: 'none' }}>
        {
          items.map((item) => {
            const { id, name, price } = item;

            return (
            <li key={id} style={{ border: 'dashed 2px white', margin: '1rem' }} onClick={() => handleItemClick(item)}>
              <div>
                <p>{name} <span>{price}</span> </p>
              </div>
            </li>
          )})
        }
      </ul>
    </section>
  );
}

export default App;
