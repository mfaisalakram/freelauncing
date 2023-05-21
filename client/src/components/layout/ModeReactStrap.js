import React, { useState,useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup } from 'reactstrap';
import $ from 'jquery'
import './ModeReactStrap.css'
const ModalExample = (props) => {
  const {
    buttonLabel,
    className
  } = props;
  const [modal, setModal] = useState(false);
  const [backdrop, setBackdrop] = useState(true);
  const [keyboard, setKeyboard] = useState(true);

  const toggle = () => setModal(!modal);


useEffect(() => {
 
    $('.button').click(function(){
        var buttonId = $(this).attr('id');
        $('#modal-container').removeAttr('class').addClass(buttonId);
        $('body').addClass('modal-active');
      })
      
      $('#modal-container').click(function(){
        $(this).addClass('out');
        $('body').removeClass('modal-active');
      });

}, [])

  const changeBackdrop = e => {
    let value = e.target.value;
    if (value !== 'static') {
      value = JSON.parse(value);
    }
    setBackdrop(value);
  }

  const changeKeyboard = e => {
    setKeyboard(e.currentTarget.checked);
  }

  return (
    <div>
     <div id="modal-container">
  <div className="modal-background">
    <div className="modal">
      <h2>I'm a Modal</h2>
      <p>Hear me roar.</p>
      <svg className="modal-svg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none">
		<rect x="0" y="0" fill="none" width="226" height="162" rx="3" ry="3"></rect>
						</svg>
    </div>
  </div>
</div>
 <div id="one" className="button">Unfolding</div>
   
 </div>
  
  );
}

export default ModalExample;