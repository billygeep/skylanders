
# skylanders
skylanders character creation webapp

angular project comprising of a simple character creation and user gallery.

menuController.js - This controller calls the data service to return the json array of bodyparts. It then creates a simple menu to house the bodypart types and displays the current tab. If the user selects a bodypart the 'bodypart-added-event' is called to add a bodypart to the display.

displayController.js - Handles the drag/drop/rotate etc of the body parts, and allows the user to submit character build to the canvas directive.

canvasController.js - Handles the data from the displayController and transforms it into the finished image for the user to save/share. This also contains the canvas directive that manages the build.