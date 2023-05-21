import React from 'react'

const SupportKit = () => {
    return (
           
    
        <div className="kit__chat">
          <button className="kit__chat__toggleButton kit__chat__actionToggle">
            <i className="fe fe-message-square mr-md-2"></i>
            <span className="d-none d-md-inline">Support Chat</span>
          </button>
          <div className="kit__chat__container">
            <div className="d-flex flex-wrap mb-2">
              <div className="text-dark font-size-18 font-weight-bold mr-auto">
                Support Chat1
              </div>
              <button className="kit__g14__closeBtn btn btn-link">
                <i className="fe fe-x-square font-size-21 align-middle text-gray-6"></i>
              </button>
            </div>
            <div className="height-300 d-flex flex-column justify-content-end">
              <div className="kit__g14__contentWrapper kit__customScroll">
                <div className="kit__g14__message">
                  <div className="kit__g14__messageContent">
                    <div className="text-gray-4 font-size-12 text-uppercase">
                      You, 5 min ago
                    </div>
                    <div>
                      Hi! Anyone here? I want to know how I can buy Clean UI KIT
                      Pro?
                    </div>
                  </div>
                  <div className="kit__g14__messageAvatar kit__utils__avatar">
                    <img
                      src="../../components/kit/core/img/avatars/avatar-2.png"
                      alt="You"
                    />
                  </div>
                </div>
                <div className="kit__g14__message kit__g14__message--answer">
                  <div className="kit__g14__messageContent">
                    <div className="text-gray-4 font-size-12 text-uppercase">
                      Mary, 14 sec ago
                    </div>
                    <div>Please call us + 100 295 000</div>
                  </div>
                  <div className="kit__g14__messageAvatar kit__utils__avatar mr-3">
                    <img
                      src="../../components/kit/core/img/avatars/2.jpg"
                      alt="Mary Stanform"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-2 pb-2">Mary is typing...</div>
            <div>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Send message..."
                  aria-label="Recipient's username"
                />
                <div className="input-group-append">
                  <button className="btn btn-primary" type="button">
                    <i className="fe fe-send align-middle"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>


    )
}

export default SupportKit
