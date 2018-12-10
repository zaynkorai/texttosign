var phrases1 = new Array();
var phrases2 = new Array();
var words1 = new Array();
var words2 = new Array();
var intraword1 = new Array();
var intraword2 = new Array();
var prefixes1 = new Array();
var prefixes2 = new Array();
var suffixes1 = new Array();
var suffixes2 = new Array();
var regex1 = new Array();
var regex2 = new Array();
var rev_regex1 = new Array();
var rev_regex2 = new Array();
var ordering1 = new Array();
var ordering2 = new Array();

function numRules() {
    return phrases1.length + phrases2.length + words1.length + words2.length + intraword1.length + intraword2.length + prefixes1.length + prefixes2.length + suffixes1.length + suffixes2.length + regex1.length + regex2.length + rev_regex1.length + rev_regex2.length + ordering1.length + ordering2.length;
}

var sentenceCount = 0;

function translate(text, direction) {

    if (text == "") return "";
    var translatedText = "";
    if (!([].concat(phrases1, phrases2, words1, words2, intraword1, intraword2, prefixes1, prefixes2, suffixes1, suffixes2, regex1, regex2, rev_regex1, rev_regex2, ordering1, ordering2).join("").length === 0)) {
        sentenceCount = 0;
        sentenceArray = text.split(/(\.)/g);
        sentenceArray = sentenceArray.filter(function(s) {
            return s !== "";
        })
        for (var i = 0; i < sentenceArray.length; i++) {
            text = sentenceArray[i];
            if (text === ".") {
                translatedText += ".";
                continue;
            }
            if (text.trim() === "") {
                translatedText += text;
                continue;
            }
            var startsWithSpace = false;
            if (text[0] === " ") {
                startsWithSpace = true;
            }
            var firstLetterIsCapital = false;
            if (text.trim()[0] === text.trim()[0].toUpperCase()) {
                firstLetterIsCapital = true;
            }
            text = text.split(" 985865568NEWLINETOKEN98758659").join("\n");
            text = text.split("985865568NEWLINETOKEN98758659").join("\n");
            text = text.replace(/(\b\S+\b)[ ]+\b\1\b/gi, "$1 $1");
            if (firstLetterIsCapital) {
                text = text[0].toUpperCase() + text.substr(1);
            }
            if (startsWithSpace) {
                text = " " + text;
            }
            translatedText += text;
            sentenceCount++;
        }
        translatedText = translatedText.split('{{*DUPLICATE MARKER*}}').join('');
        if (typeof doApplySentenceCase !== 'undefined') {
            if (doApplySentenceCase !== false) {
                translatedText = applySentenceCase(translatedText);
                translatedText = capitalizeFirstLetter(translatedText);
            }
        }
    } else {
        translatedText = text;
    }
    if (typeof forward === "function") {
        translatedText = forward(translatedText);
    }
    return translatedText;
}

function applySentenceCase(str) {
    return str.replace(/.+?[\.\?\!](\s|$)/g, function(txt) {
        if (txt.charAt(0).match(/[a-z]/g) !== null) return txt.charAt(0).toUpperCase() + txt.substr(1);
        else return txt;
    });
}

function capitalizeFirstLetter(string) {
    if (string.charAt(0).match(/[a-z]/g) !== null) return string.charAt(0).toUpperCase() + string.slice(1);
    else return string;
}

function phraseSwap(phrases1, phrases2, text) {
    var wordSeps = new Array(" ", ",", ".", "'", "!", ":", "?", "\"", ";", "/", "<", ">", ")", "(", "%", "$");
    var phrases2 = makeArrayClone(phrases2);
    for (var i = 0; i < phrases2.length; i++) {
        phrases2[i] = tokenate(phrases2[i]);
    }
    for (var i = 0; i < phrases1.length; i++) {
        for (var j = 0; j < wordSeps.length; j++) {
            if (phrases2[i] !== "") text = text.split(" " + phrases1[i].toLowerCase() + wordSeps[j]).join(" " + phrases2[i] + wordSeps[j]);
            else text = text.split(" " + phrases1[i].toLowerCase() + wordSeps[j]).join(" ");
        }
    }
    return text;
}


function escapeRegex(regex) {
    return regex.replace(/([()[{*+.$^\\|?])/g, '\\$1');
}

function prefixSwap(prefixes1, prefixes2, text) {
    var prefixes2 = makeArrayClone(prefixes2);
    for (var i = 0; i < prefixes2.length; i++) {
        prefixes2[i] = tokenate(prefixes2[i]);
    }
    for (var i = 0; i < prefixes1.length; i++) {
        text = text.replace(new RegExp("\\s" + escapeRegex(prefixes1[i]) + "([^\\s])", 'g'), " " + prefixes2[i] + "$1");
    }
    return text;
}

function suffixSwap(suffixes1, suffixes2, text) {
    var suffixes2 = makeArrayClone(suffixes2);
    for (var i = 0; i < suffixes2.length; i++) {
        suffixes2[i] = tokenate(suffixes2[i]);
    }
    for (var i = 0; i < suffixes1.length; i++) {
        text = text.replace(new RegExp("([^\\s])" + escapeRegex(suffixes1[i]) + "\\s", 'g'), "$1" + suffixes2[i] + " ");
    }
    return text;
}

function regexReplace(regex1, regex2, text) {
    for (var i = 0; i < regex1.length; i++) {
        if (typeof regex2[0] == 'string' || regex2[0] instanceof String) {
            var match = regex1[i].match(new RegExp('^/(.*?)/([gimy]*)$'));
            if (match) {
                var properRegEx = new RegExp(match[1], match[2]);
                text = text.replace(properRegEx, regex2[i]);
            }
        }
    }
    return text;
}

function wordOrdering(ordering1, ordering2, text) {
    for (var i = 0; i < ordering1.length; i++) {
        var regex = new RegExp('([^\\s]+){{' + ordering1[i].trim().replace(/[\s]+/g, " ").split(" ").join('}}[\\s]+([^\\s]+){{') + '}}', 'g');
        var orderString = getRelativeOrder(ordering1[i].replace(/[\s]+/g, " ").split(" "), ordering2[i].replace(/[\s]+/g, " ").split(" "));
        text = text.replace(regex, "$" + orderString.split(',').join(" $"));
    }
    var alreadyRemovedTags = [];
    for (var i = 0; i < ordering1.length; i++) {
        var tags = ordering1[i].trim().replace(/[\s]+/g, " ").split(" ");
        for (var j = 0; j < tags.length; j++) {
            if (alreadyRemovedTags.indexOf(tags[j]) === -1) {
                text = text.replace("{{" + tags[j] + "}}", "");
                alreadyRemovedTags.push(tags[j]);
            }
        }
    }
    return text;
}

function getRelativeOrder(truth, jumbled) {
    var order = [];
    for (var i = 0; i < jumbled.length; i++) {
        if (truth.indexOf(jumbled[i]) !== -1) {
            order.push(truth.indexOf(jumbled[i]) + 1);
        } else {}
    }
    return order.join(",");
}


function makeArrayClone(existingArray) {
    var newObj = (existingArray instanceof Array) ? [] : {};
    for (i in existingArray) {
        if (i == 'clone') continue;
        if (existingArray[i] && typeof existingArray[i] == "object") {
            newObj[i] = makeArrayClone(existingArray[i]);
        } else {
            newObj[i] = existingArray[i]
        }
    }
    return newObj;
}
var randomSentences = ["Burn peat after the logs give out.", "He ordered peach pie with ice cream.", "Weave the carpet on the right hand side.", "Hemp is a weed found in parts of the tropics.", "A lame back kept his score low.", "We find joy in the simplest things.", "Type out three lists of orders.", "The harder he tried the less he got done.", "The boss ran the show with a watchful eye.", "The cup cracked and spilled its contents.", "Paste can cleanse the most dirty brass.", "The slang word for raw whiskey is booze.", "It caught its hind paw in a rusty trap.", "The wharf could be seen at the farther shore.", "Feel the heat of the weak dying flame.", "The tiny girl took off her hat.", "A cramp is no small danger on a swim.", "He said the same phrase thirty times.", "Pluck the bright rose without leaves.", "Two plus seven is less than ten.", "The glow deepened in the eyes of the sweet girl.", "Bring your problems to the wise chief.", "Write a fond note to the friend you cherish.", "Clothes and lodging are free to new men.", "We frown when events take a bad turn.", "Port is a strong wine with s smoky taste.", "The young kid jumped the rusty gate.", "Guess the results from the first scores.", "A salt pickle tastes fine with ham.", "The just claim got the right verdict.", "These thistles bend in a high wind.", "Pure bred poodles have curls.", "The tree top waved in a graceful way.", "The spot on the blotter was made by green ink.", "Mud was spattered on the front of his white shirt.", "The cigar burned a hole in the desk top.", "The empty flask stood on the tin tray.", "They felt gay when the ship arrived in port.", "Add the store's account to the last cent.", "Acid burns holes in wool cloth.", "Fairy tales should be fun to write.", "Eight miles of woodland burned to waste.", "The third act was dull and tired the players.", "A young child should not suffer fright.", "Add the column and put the sum here.", "We admire and love a good cook.", "There the flood mark is ten inches.", "He carved a head from the round block of marble.", "She has st smart way of wearing clothes.", "The fruit of a fig tree is apple-shaped.", "Corn cobs can be used to kindle a fire.", "Where were they when the noise started.", "The paper box is full of thumb tacks.", "Sell your gift to a buyer at a good gain.", "The tongs lay beside the ice pail.", "The petals fall with the next puff of wind.", "Bring your best compass to the third class.", "They could laugh although they were sad.", "Farmers came in to thresh the oat crop.", "The brown house was on fire to the attic.", "The lure is used to catch trout and flounder.", "Float the soap on top of the bath water.", "A blue crane is a tall wading bird.", "A fresh start will work such wonders.", "The club rented the rink for the fifth night.", "After the dance they went straight home.", "They took the axe and the saw to the forest.", "The ancient coin was quite dull and worn.", "The shaky barn fell with a loud crash.", "Jazz and swing fans like fast music.", "Rake the rubbish up and then burn it.", "Slash the gold cloth into fine ribbons.", "Try to have the court decide the case.", "They are pushed back each time they attack.", "He broke his ties with groups of former friends.", "They floated on the raft to sun their white backs.", "The map had an X that meant nothing.", "Whitings are small fish caught in nets.", "Some ads serve to cheat buyers.", "Jerk the rope and the bell rings weakly.", "A waxed floor makes us lose balance.", "Madam, this is the best brand of corn.", "On the islands the sea breeze is soft and mild.", "The play began as soon as we sat down.", "This will lead the world to more sound and fury", "Add salt before you fry the egg.", "The rush for funds reached its peak Tuesday.", "The birch looked stark white and lonesome.", "The box is held by a bright red snapper.", "To make pure ice, you freeze water.", "The first worm gets snapped early.", "Jump the fence and hurry up the bank.", "Yell and clap as the curtain slides back.", "They are men nho walk the middle of the road.", "Both brothers wear the same size.", "In some forin or other we need fun.", "The prince ordered his head chopped off.", "The houses are built of red clay bricks.", "Ducks fly north but lack a compass.", "Fruit flavors are used in fizz drinks.", "These pills do less good than others.", "Canned pears lack full flavor.", "The dark pot hung in the front closet.", "Carry the pail to the wall and spill it there.", "The train brought our hero to the big town.", "We are sure that one war is enough.", "Gray paint stretched for miles around.", "The rude laugh filled the empty room.", "High seats are best for football fans.", "Tea served from the brown jug is tasty.", "A dash of pepper spoils beef stew.", "A zestful food is the hot-cross bun.", "The horse trotted around the field at a brisk pace.", "Find the twin who stole the pearl necklace.", "Cut the cord that binds the box tightly.", "The red tape bound the smuggled food.", "Look in the corner to find the tan shirt.", "The cold drizzle will halt the bond drive.", "Nine men were hired to dig the ruins.", "The junk yard had a mouldy smell.", "The flint sputtered and lit a pine torch.", "Soak the cloth and drown the sharp odor.", "The shelves were bare of both jam or crackers.", "A joy to every child is the swan boat.", "All sat frozen and watched the screen.", "ii cloud of dust stung his tender eyes.", "To reach the end he needs much courage.", "Shape the clay gently into block form.", "The ridge on a smooth surface is a bump or flaw.", "Hedge apples may stain your hands green.", "Quench your thirst, then eat the crackers.", "Tight curls get limp on rainy days.", "The mute muffled the high tones of the horn.", "The gold ring fits only a pierced ear.", "The old pan was covered with hard fudge.", "Watch the log float in the wide river.", "The node on the stalk of wheat grew daily.", "The heap of fallen leaves was set on fire.", "Write fast, if you want to finish early.", "His shirt was clean but one button was gone.", "The barrel of beer was a brew of malt and hops.", "Tin cans are absent from store shelves.", "Slide the box into that empty space.", "The plant grew large and green in the window.", "The beam dropped down on the workmen's head.", "Pink clouds floated JTith the breeze.", "She danced like a swan, tall and graceful.", "The tube was blown and the tire flat and useless.", "It is late morning on the old wall clock.", "Let's all join as we sing the last chorus.", "The last switch cannot be turned off.", "The fight will end in just six minutes.", "The store walls were lined with colored frocks.", "The peace league met to discuss their plans.", "The rise to fame of a person takes luck.", "Paper is scarce, so write with much care.", "The quick fox jumped on the sleeping cat.", "The nozzle of the fire hose was bright brass.", "Screw the round cap on as tight as needed.", "Time brings us many changes.", "The purple tie was ten years old.", "Men think and plan and sometimes act.", "Fill the ink jar with sticky glue.", "He smoke a big pipe with strong contents.", "We need grain to keep our mules healthy.", "Pack the records in a neat thin case.", "The crunch of feet in the snow was the only sound.", "The copper bowl shone in the sun's rays.", "Boards will warp unless kept dry.", "The plush chair leaned against the wall.", "Glass will clink when struck by metal.", "Bathe and relax in the cool green grass.", "Nine rows of soldiers stood in line.", "The beach is dry and shallow at low tide.", "The idea is to sew both edges straight.", "The kitten chased the dog down the street.", "Pages bound in cloth make a book.", "Try to trace the fine lines of the painting.", "Women form less than half of the group.", "The zones merge in the central part of town.", "A gem in the rough needs work to polish.", "Code is used when secrets are sent.", "Most of the new is easy for us to hear.", "He used the lathe to make brass objects.", "The vane on top of the pole revolved in the wind.", "Mince pie is a dish served to children.", "The clan gathered on each dull night.", "Let it burn, it gives us warmth and comfort.", "A castle built from sand fails to endure.", "A child's wit saved the day for us.", "Tack the strip of carpet to the worn floor.", "Next Tuesday we must vote.", "Pour the stew from the pot into the plate.", "Each penny shone like new.", "The man went to the woods to gather sticks.", "The dirt piles were lines along the road.", "The logs fell and tumbled into the clear stream.", "Just hoist it up and take it away,", "A ripe plum is fit for a king's palate.", "Our plans right now are hazy.", "Brass rings are sold by these natives.", "It takes a good trap to capture a bear.", "Feed the white mouse some flower seeds.", "The thaw came early and freed the stream.", "He took the lead and kept it the whole distance.", "The key you designed will fit the lock.", "Plead to the council to free the poor thief.", "Better hash is made of rare beef.", "This plank was made for walking on.", "The lake sparkled in the red hot sun.", "He crawled with care along the ledge.", "Tend the sheep while the dog wanders.", "It takes a lot of help to finish these.", "Mark the spot with a sign painted red.", "Take two shares as a fair profit.", "The fur of cats goes by many names.", "North winds bring colds and fevers.", "He asks no person to vouch for him.", "Go now and come here later.", "A sash of gold silk will trim her dress.", "Soap can wash most dirt away.", "That move means the game is over.", "He wrote down a long list of items.", "A siege will crack the strong defense.", "Grape juice and water mix well.", "Roads are paved with sticky tar.", "Fake &ones shine but cost little.", "The drip of the rain made a pleasant sound.", "Smoke poured out of every crack.", "Serve the hot rum to the tired heroes.", "Much of the story makes good sense.", "The sun came up to light the eastern sky.", "Heave the line over the port side.", "A lathe cuts and trims any wood.", "It's a dense crowd in two distinct ways.", "His hip struck the knee of the next player.", "The stale smell of old beer lingers.", "The desk was firm on the shaky floor.", "It takes heat to bring out the odor.", "Beef is scarcer than some lamb.", "Raise the sail and steer the ship northward.", "The cone costs five cents on Mondays.", "A pod is what peas always grow in.", "Jerk the dart from the cork target.", "No cement will hold hard wood.", "We now have a new base for shipping.", "The list of names is carved around the base.", "The sheep were led home by a dog.", "Three for a dime, the young peddler cried.", "The sense of smell is better than that of touch.", "No hardship seemed to keep him sad.", "Grace makes up for lack of beauty.", "Nudge gently but wake her now.", "The news struck doubt into restless minds.", "Once we stood beside the shore.", "A chink in the wall allowed a draft to blow.", "Fasten two pins on each side.", "A cold dip restores health and zest.", "He takes the oath of office each March.", "The sand drifts over the sill of the old house.", "The point of the steel pen was bent and twisted.", "There is a lag between thought and act.", "Seed is needed to plant the spring corn.", "Draw the chart with heavy black lines.", "The boy owed his pal thirty cents.", "The chap slipped into the crowd and was lost.", "Hats are worn to tea and not to dinner.", "The ramp led up to the wide highway.", "Beat the dust from the rug onto the lawn.", "Say it slow!y but make it ring clear.", "The straw nest housed five robins.", "Screen the porch with woven straw mats.", "This horse will nose his way to the finish.", "The dry wax protects the deep scratch.", "He picked up the dice for a second roll.", "These coins will be needed to pay his debt.", "The nag pulled the frail cart along.", "Twist the valve and release hot steam.", "The vamp of the shoe had a gold buckle.", "The smell of burned rags itches my nose.", "Xew pants lack cuffs and pockets.", "The marsh will freeze when cold enough.", "They slice the sausage thin with a knife.", "The bloom of the rose lasts a few days.", "A gray mare walked before the colt.", "Breakfast buns are fine with a hot drink.", "Bottles hold four kinds of rum.", "The man wore a feather in his felt hat.", "He wheeled the bike past. the winding road.", "Drop the ashes on the worn old rug.", "The desk and both chairs were painted tan.", "Throw out the used paper cup and plate.", "A clean neck means a neat collar.", "The couch cover and hall drapes were blue.", "The stems of the tall glasses cracked and broke.", "The wall phone rang loud and often.", "The clothes dried on a thin wooden rack.", "Turn on the lantern which gives us light.", "The cleat sank deeply into the soft turf.", "The bills were mailed promptly on the tenth of the month.", "To have is better than to wait and hope.", "The price is fair for a good antique clock.", "The music played on while they talked.", "Dispense with a vest on a day like this.", "The bunch of grapes was pressed into wine.", "He sent the figs, but kept the ripe cherries.", "The hinge on the door creaked with old age.", "The screen before the fire kept in the sparks.", "Fly by night, and you waste little time.", "Thick glasses helped him read the print.", "Birth and death mark the limits of life.", "The chair looked strong but had no bottom.", "The kite flew wildly in the high wind.", "A fur muff is stylish once more.", "The tin box held priceless stones.", "We need an end of all such matter.", "The case was puzzling to the old and wise.", "The bright lanterns were gay on the dark lawn.", "We don't get much money but we have fun.", "The youth drove with zest, but little skill.", "Five years he lived with a shaggy dog.", "A fence cuts through the corner lot.", "The way to save money is not to spend much.", "Shut the hatch before the waves push it in.", "The odor of spring makes young hearts jump.", "Crack the walnut with your sharp side teeth.", "He offered proof in the form of a lsrge chart.", "Send the stuff in a thick paper bag.", "A quart of milk is water for the most part.", "They told wild tales to frighten him.", "The three story house was built of stone.", "In the rear of the ground floor was a large passage.", "A man in a blue sweater sat at the desk."];