function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function getRandomChoice(arr) {
    return arr[getRandomInt(0, arr.length)];
}

function cleanFromHTML(str) {
    return str.replace(/<\/?[^>]+(>|$)/g, "");
}


// Update this things
const COMMANDS = {
    "help": () => {
        return "\
help     Prints out all available commands<br>\
echo     Echoes given text (because why not)<br>\
clear    Clears the console<br>\
motd     Updates the Message of The Day\
";
    },
    "echo": (...text) => { return text.join(" "); },
    "clear": () => {
        terminalHeader.innerHTML = "";
        terminalOutput.innerHTML = "";
    },
    "motd": () => {
        let temp = motd;
        while (temp === motd) {
            temp = getRandomChoice(MOTDS);
        }
        motd = temp;
        updateHeader();
    }
}
const MOTDS = [
    "Sometimes, <b>figuring out</b> is the most entertaining thing to do.",
    "There are definitely more things to come <b>;)</b>",
    "No, this website is not made with <a href=\"https://github.com/jcubic/jquery.terminal\">\"jquery.terminal\"</a>. Although it looks nice.",
    "GUIs were introduced by a devil."
];
const TITLE = "SybTerminal";
const VERSION = "v0.0.0001";

function updateHeader() {
    const titleLength = `${TITLE} ${VERSION}`.length;
    const motdLength = cleanFromHTML(motd).length;

    const titleLine = `| ${TITLE} ${VERSION}` + " ".repeat(Math.max(motdLength - titleLength, 0)) + " |";
    const motdLine = `| ${motd}` + " ".repeat(Math.max(titleLength - motdLength, 0)) + " |";
    const borderLine = `|=` + "=".repeat(Math.max(motdLength, titleLength)) + "=|";
    const terminalHeaderLines = `<regular>${borderLine}</regular>
                                <regular>${titleLine}</regular>
                                <regular>${motdLine}</regular>
                                <regular>${borderLine}</regular>`;

    terminalHeader.innerHTML = terminalHeaderLines
}
// end

let motd = getRandomChoice(MOTDS);

const terminalHeader = document.getElementById("terminal-header");
updateHeader(motd);

const terminalInput = document.getElementById("terminal-input");
const terminalInputPrompt = document.getElementById("terminal-input-prompt");
const terminalOutput = document.getElementById("terminal-output");


function handleCommand(query, recursive) {
    if (recursive != true) {
        terminalOutput.innerHTML += `>${query}<br><br>`;
    }

    if (query.includes(";")) {
        let [...cmds] = query.split(";");
        for (let cmd of cmds) {
            handleCommand(cmd.trimStart(), true);
        }
        return;
    }

    let [cmd, ...args] = query.split(/\s+/);
    let resultedStr;

    if (cmd in COMMANDS) {
        resultedStr = COMMANDS[cmd](...args);
    } else {
        resultedStr = `Unknown command: "${cmd}". Use "help" to get info about all available commands.`;
    }

    if (resultedStr) {
        terminalOutput.innerHTML += resultedStr.replace(/\s/g, '&nbsp;');
        terminalOutput.innerHTML += "<br><br>";
    }
}

setTimeout(() => {
    terminalInput.style.opacity = 1;

    document.querySelector("html").addEventListener("click", (e) => {
        terminalInputPrompt.focus();
    })

    document.querySelector("html").addEventListener("keydown", (e) => {
        if (e.key == "Enter") {
            e.preventDefault();

            const query = terminalInputPrompt.innerText;

            console.log(query);
            handleCommand(query);
            terminalInputPrompt.innerText = "";
        }
    });
}, 500);


const config = { childList: true };

const callback = function (mutationsList, _) {
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }
};

const observer = new MutationObserver(callback);
observer.observe(terminalOutput, config);


