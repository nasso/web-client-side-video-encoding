import "./style.scss";

export default class DOMConsole {
    constructor(el) {
        this.el = el;

        this.term = document.createElement("div");
        this.term.classList.add("domconsole_term");
        this.el.appendChild(this.term);
    }

    newline() {
        this.term.appendChild(document.createElement("br"));
    }

    write(s, streamname) {
        let output = document.createElement("span");
        output.classList.add(`domconsole_stream_${streamname}`);
        output.innerHTML = s.toString();

        this.term.appendChild(output);
    }

    print(s) {
        this.write(s, "stdout");
    }

    println(s) {
        this.print(s);
        this.newline();
    }

    eprint(s) {
        this.write(s, "stderr");
    }

    eprintln(s) {
        this.eprint(s);
        this.newline();
    }
}
