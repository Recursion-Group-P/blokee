<template>
  <q-page class="flex flex-center column" padding>
    <div class="">
      <img src="../assets/blockee-logo.png" alt="">
    </div>
    <div id="app" class="loading">
      <div id="logo">
        <div class="symbol">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div class="symbol">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div class="symbol">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div class="symbol">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div class="symbol">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
    <q-btn rounded size="lg" color="grey" text-color="white" label="Get Started" to="/settings" />
  </q-page>
</template>

<script>
  export default {
  }
</script>

<style>
  @import url(https://fonts.googleapis.com/css?family=Lato:400,900);

  button {
    font-family: avenir, 'Lato', sans-serif;
    font-weight: 400;
  }

  #app {
    position: absolute;
    width: 70%;
    height: 70%;
    color: white;
    top: 0;
  }

  #app a {
    color: #EAEAEA;
  }

  .symbol {
    top: 0;
    animation: rotateX 2s 1 ease-in-out;
  }

  .symbol {
    position: relative;
    float: left;
    width: 4em;
    height: 4em;
    transition: transform 2s linear;
    transform-style: preserve-3d;
    transform-origin: 2em 2em;
    transition: all 1.5s ease-in-out;
    /* animation: fall 2s 1 ease-in-out; */
  }

  .symbol:nth-child(1) {
    z-index: 1;
    animation-delay: 400ms;
  }

  .symbol:nth-child(2) {
    z-index: 2;
    animation-delay: 500ms;
  }

  .symbol:nth-child(3) {
    z-index: 3;
    animation-delay: 600ms;
  }

  .symbol:nth-child(4) {
    z-index: 2;
    animation-delay: 700ms;
  }

  .symbol:nth-child(5) {
    z-index: 1;
    animation-delay: 800ms;
  }

  @keyframes rotateX {
    0% {
      transform: rotateX(0deg);
    }

    100% {
      transform: rotateX(360deg);
    }
  }

  /* @keyframes fall {
    0% {
      transform: rotateX(0deg) translateY(0em);
      opacity: 1;
    }

    100% {
      transform: rotateX(120deg) translateY(60em);
      opacity: 0;
    }
  } */

  #logo {
    z-index: 100;
    position: absolute;
    left: 50%;
    top: 50%;
    width: 20em;
    height: 4em;
    margin-left: -10em;
    margin-top: -4em;
    font-size: 16px;
    transform: translateZ(9999px);
    perspective: 800;
    transition: top 1.5s ease-in-out;
  }

  .symbol {
    position: relative;
    float: left;
    width: 4em;
    height: 4em;
    transition: transform 2s linear;
    transform-style: preserve-3d;
    transform-origin: 2em 2em;
    transition: all 1.5s ease-in-out;
    /* animation: fall 2s 1 ease-in-out; */
  }

  .loading .symbol {
    top: 0;
    animation: rotateX 2s 1 ease-in-out;
  }

  .symbol:nth-child(1) {
    z-index: 1;
    animation-delay: 400ms;
  }

  .symbol:nth-child(2) {
    z-index: 2;
    animation-delay: 500ms;
  }

  .symbol:nth-child(3) {
    z-index: 3;
    animation-delay: 600ms;
  }

  .symbol:nth-child(4) {
    z-index: 2;
    animation-delay: 700ms;
  }

  .symbol:nth-child(5) {
    z-index: 1;
    animation-delay: 800ms;
  }

  @keyframes rotateX {
    0% {
      transform: rotateX(0deg);
    }

    100% {
      transform: rotateX(360deg);
    }
  }

  /* @keyframes fall {
    0% {
      transform: rotateX(0deg) translateY(0em);
      opacity: 1;
    }

    100% {
      transform: rotateX(120deg) translateY(60em);
      opacity: 0;
    }
  } */

  .symbol>div {
    position: absolute;
    width: 4em;
    height: 4em;
    transform-style: preserve-3d;
    background-color: white;
  }

  .symbol div:nth-child(1) {
    transform: translateZ(2em);
  }

  .symbol div:nth-child(2) {
    transform: rotateY(90deg) translateZ(2em);
    background-color: #A0A0A0;
  }

  .symbol div:nth-child(3) {
    transform: rotateY(180deg) translateZ(2em);
    background-color: #D0D0D0;
  }

  .symbol div:nth-child(4) {
    transform: rotateY(-90deg) translateZ(2em);
    background-color: #A0A0A0;
  }

  .symbol div:nth-child(5) {
    transform: rotateX(-90deg) translateZ(2em) rotate(180deg);
    background-color: #E0E0E0;
  }

  .symbol div:nth-child(6) {
    transform: rotateX(90deg) translateZ(2em);
    background-color: #C0C0C0;
  }

  .symbol>div:first-child {
    background-color: #101010;
    border: .25em solid white;
  }

  .symbol>div:first-child:before,
  .symbol>div:first-child:after {
    content: "";
    position: absolute;
  }

  .symbol:nth-child(1)>div:first-child {
    background-color: white;
    overflow: hidden;
  }

  .symbol:nth-child(1)>div:first-child:before,
  .symbol:nth-child(1)>div:first-child:after {
    background-color: #101010;
  }

  .symbol:nth-child(1)>div:first-child:before {
    width: 4em;
    height: 1.2em;
    top: 1.2em;
  }

  .symbol:nth-child(1)>div:first-child:after {
    right: 1.2em;
    width: 1.2em;
    height: 4em;
  }

  .symbol:nth-child(2)>div:first-child {
    background-color: #101010;
    overflow: hidden;
  }

  .symbol:nth-child(2)>div:first-child:before,
  .symbol:nth-child(2)>div:first-child:after {
    right: 0;
    width: 2.4em;
    height: 1.2em;
    background-color: white;
  }

  .symbol:nth-child(2)>div:first-child:before {
    top: 0;
  }

  .symbol:nth-child(2)>div:first-child:after {
    bottom: 0;
  }

  .symbol:nth-child(3)>div:first-child {
    background-color: #101010;
    overflow: hidden;
  }

  .symbol:nth-child(3)>div:first-child:before,
  .symbol:nth-child(3)>div:first-child:after {
    background-color: white;
    width: 1.2em;
    height: 2.4em;
  }

  .symbol:nth-child(3)>div:first-child:before {
    right: 0;
    top: 0;
  }

  .symbol:nth-child(3)>div:first-child:after {
    left: 0;
    bottom: 0;
  }

  .symbol:nth-child(4)>div:first-child:before {
    right: 0;
    top: 0;
    width: 2.5em;
    height: 2.5em;
    background-color: white;
  }

.symbol:nth-child(5)>div:first-child {
  background-color: #101010;
  overflow: hidden;
}

.symbol:nth-child(5)>div:first-child:before,
.symbol:nth-child(5)>div:first-child:after {
  background-color: white;
}

.symbol:nth-child(5)>div:first-child:before {
  width: 4em;
  height: .2em;
  top: 1.7em;
}

.symbol:nth-child(5)>div:first-child:after {
  right: 1.7em;
  width: .2em;
  height: 4em;
}

</style>
