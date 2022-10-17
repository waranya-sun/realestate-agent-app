import React from 'react';
import { Link } from 'react-router-dom';
import rentImg from '../assets/rentImg.jpg';
import saleImg from '../assets/saleImg.jpg';

function MainContent() {
  return (
    <>
      <div className='heading-maincontent'>All You Need Is One Click Away</div>
      <div className='categories'>
        <div></div>
        <div className='category-card'>
          <Link to='/category/rent'>
            <div className='category'>
              <div className='category-text'>Places for Rent</div>
              <img className='category-img' src={rentImg} alt='' />
            </div>
          </Link>
        </div>
        <div></div>
        <div className='category-card'>
          <Link to='/category/sale'>
            <div className='category'>
              <div className='category-text'>Places for Sale</div>
              <img className='category-img' src={saleImg} alt='' />
            </div>
          </Link>
        </div>
        <div></div>
      </div>
    </>
  );
}

export default MainContent;

//For give credits of images
// Photo by <a href="https://unsplash.com/@ricardodeavelar?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Ricardo Avelar</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

// Photo by <a href="https://unsplash.com/@spacejoy?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Spacejoy</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

// Photo by <a href="https://unsplash.com/@im3rdmedia?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Im3rd Media</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

// Photo by <a href="https://unsplash.com/@53muratdemircan?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Murat Demircan</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

// Photo by <a href="https://unsplash.com/@sidekix?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Sidekix Media</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

// Photo by <a href="https://unsplash.com/@jonathanborba?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jonathan Borba</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

// Photo by <a href="https://unsplash.com/@rarchitecture_melbourne?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">R ARCHITECTURE</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

// Photo by <a href="https://unsplash.com/@trinwin?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Trinity Nguyen</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

// Photo by <a href="https://unsplash.com/@bernardhermant?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Bernard Hermant</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

// Photo by <a href="https://unsplash.com/@rivphoto?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Greg Rivers</a> on <a href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

// Photo by <a href="https://unsplash.com/@spacejoy?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Spacejoy</a> on <a href="https://unsplash.com/s/photos/living-room-interior-design?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

// Photo by <a href="https://unsplash.com/@ntwrk_img?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Digital Marketing Agency NTWRK</a> on <a href="https://unsplash.com/@ntwrk_img?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
