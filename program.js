(function() {
	function debug(msg) {
		// Find the debug section
		var log = document.getElementById("debuglog");
		
		if(!log) {
			log = document.createElement("div");
			log.id = "debuglog";
			log.innerHTML = "<h1>Debug Log</h1>";
			document.body.appendChild(log);
		}
		
		var pre = document.createElement("pre");
		var text = document.createTextNode(msg);
		pre.appendChild(text);
		log.appendChild(pre);
	}
	
	var lwr = 'abcdefghijklmnopqrstuvwxyzåäö';
	var upr = lwr.toUpperCase();
	var numbers = "0123456789";
	
	function searchChar(parm, val) {
		if (parm == "") return true;
		for (i=0; i<parm.length; i++) {
			if (val.indexOf(parm.charAt(i),0) == -1) return false;
		}
		return true;
	}

	function isNumber(char) {
		return numbers.indexOf(char) != -1;
	}

	function isValid(parm) {
		return searchChar(parm, lwr + upr + numbers);
	}
	
	function get_image(key) {
		return get_key_name(key) + ".jpg"
	}

    function get_key_name(key) {
        key = key.toLowerCase();
        if(key == 'ä')
            return "a_uml";
        else if(key == "å")
            return "a_o";
        else if(key == "ö")
            return "o_uml";
        else if ((key >= "a" && key <= "z") || (key >= "0" && key <= "9"))
            return key;
        else
            return "a";
    }

	function get_sound_name(key) {
        return get_key_name(key);
	}
	
	function get_entry(key) {
		if(key == null || !isValid(key)) {
			return null;
		} 
		key = key.toUpperCase();
		entry = new Object();
		if (isNumber(key)) {
			entry.title = key;
		} else {
			entry.title = key.toUpperCase() + " " + key.toLowerCase();
		}
		entry.image = get_image(key);
		entry.sound = get_sound_name(key);
		return entry;
	}
	
	function update_image(image_name) {
		imgFldr = 'images/';
		$("#image").attr('src', imgFldr+image_name);
	}
	
	// Key should be one-character string
	function update_key(key) {
		entry = get_entry(key);
		if(entry == null) {
			return;
		}
		$("#greeting").text("");
		$("#key_label").text(entry.title);
		update_image(entry.image);
		$("#image").show();
		play_sound(entry.sound);
		ga('send', 'event', 'key', 'click', entry.title);
	}
	
	function generate_sound_name(name, extension) {
		return "audio/" + name + "." + extension;
	}
	
	var a = null;
	
	function play_sound(name) {
		if(a != null) {
			a.pause();
		} else {
			a = new Audio();
		}
		if(a.canPlayType("audio/mp3")) {
			name = generate_sound_name(name, "mp3");
			a.src = name;
			a.play();
		} else if(a.canPlayType("audio/ogg; codec=vorbis")) {
			name = generate_sound_name(name, "ogg");
			a.src = name;
			a.play();
		} else {
			debug("audio/mp3 not supported");
		}
	}
	
	
	// Register keypress listener
	$(function() {
		$("#image").hide();
		$(window).keypress(function(e) {
			var key = e.which;
			// debug(key);
			str = String.fromCharCode(key);
			update_key(str);
		});
	});
}());

