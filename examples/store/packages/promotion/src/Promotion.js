import React from 'react';
import ShowcaseApi from 'showcase';
import './Promotion.css';

const promotions = [
  {
    tag: 'GAME',
    name: 'Cool games',
    image: 'https://wallpaperaccess.com/full/774615.jpg',
  },
  {
    tag: 'TECH',
    name: 'High tech things',
    image:
      'https://scontent.fcpq4-1.fna.fbcdn.net/v/t1.0-9/35026251_1668788026524363_7280884965984698368_o.jpg?_nc_cat=104&_nc_sid=dd9801&_nc_ohc=eNuZSWFml0kAX_RH-E4&_nc_ht=scontent.fcpq4-1.fna&oh=e26b701ba83d66522be60c8310d13130&oe=5EEB7F38',
  },
  {
    tag: 'DRINK',
    name: 'Awesome drinks',
    image: 'https://wallup.net/wp-content/uploads/2017/11/22/376166-drink-Jack_Daniels-748x499.jpg',
  },
];
function Promotion({ onPromotionSelected }) {
  const handlePromotionClick = (promotion) => {
    ShowcaseApi.callFilterByTag(promotion.tag);
    onPromotionSelected();
  };
  return (
    <div className="Promotion">
      {Object.values(promotions).map((promotion) => (
        <div
          key={promotion.tag}
          className="Promotion__item"
          role="button"
          tabIndex={-1}
          onClick={() => handlePromotionClick(promotion)}
        >
          <img src={promotion.image} className="Promotion__item-image" />
          <div className="Promotion__item-title">{promotion.name}</div>
        </div>
      ))}
    </div>
  );
}

export default Promotion;
