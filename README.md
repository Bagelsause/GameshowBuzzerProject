# GiggleGames

This was a commission from someone regarding a custom browser source for a self-sustainable stream idea.

Just as a TLDR for my decisions in this project:
- We are using Firestore for storing all user information, as we want to limit frontend processing as much as possible
    - This, as expected, isn't scalable to large users and large transactions while remaining zero-cost, but this is self sustaining iff its utilized properly
- This button-to-browsersource communication CAN be done with sockets, but I am not confident enough in my ability to have github host the frontend AND manage socket rooms (as im certain that github will have it's moments of failure aswell)
- I'm not using a "components" folder and everything just for simplicity, further implementations/work with this could utilize a components folder, preloaded CSS, maybe even a CDN (content distribution network), but as of current, that is too much overhead for generating this simplistic-yet-realistic product.
- Firebase configuration *is meant to be public*, as by design of firebase and firestore.
- All of the networking/styling/hosting is meant to be self-sustainable and zero-cost, both with the same priority. If it becomes inevitable that some amount of money must be paid to support a dedicated server (and not just github pages), then so be it, but my primary goal is to prevent that from happening.

No server code is present, as we don't necessarily need server code for this. The closest thing to the "server" that we have is the browser source page, but (as displayed in the structure of this) we can just have React handle all of that processing for us, so we don't even need to run any external functions in the browser source itself (outside of maintaining an updated display/mounting components).
