(function(){
	jQuery.fn.jGetFormData = function(submit_disabled_elements){
		var _this = this;

		this.ManipulateFormData = function(){
			var prefix = '';
			parent = _this[0];

			var aFormValues = {};

			if (parent)
				if (parent.childNodes)
					_this.GetFormValues(aFormValues, parent.childNodes, submit_disabled_elements, prefix);

			return aFormValues;
		};
		this.GetFormValues = function(aFormValues, children, submitDisabledElements, prefix){
			var iLen = children.length;
			for (var i = 0; i < iLen; ++i)
			{
				var child = children[i];
				if (('undefined' != typeof child.childNodes) && (child.type != 'select-one') && (child.type != 'select-multiple'))
				{
					_this.GetFormValues(aFormValues, child.childNodes, submitDisabledElements, prefix);
				}

				_this.GetSingleElementValue(aFormValues, child, submitDisabledElements, prefix);
			}
		};
		this.GetSingleElementValue = function(aFormValues, child, submitDisabledElements, prefix){
			if (!child.name)
				return;

			if ('PARAM' == child.tagName) return;

			if (child.disabled)
				if (true == child.disabled)
					if (false == submitDisabledElements)
						return;

			if (prefix != child.name.substring(0, prefix.length))
				return;

			if (child.type)
				if (child.type == 'radio' || child.type == 'checkbox')
					if (false == child.checked)
						return;

			var name = child.name;

			var values = [];

			if ('select-multiple' == child.type) {
				var jLen = child.length;
				for (var j = 0; j < jLen; ++j) {
					var option = child.options[j];
					if (true == option.selected)
						values.push(option.value);
				}
			} else {
				values = child.value;
			}

			var keyBegin = name.indexOf('[');
			if (0 <= keyBegin) {
				var n = name;
				var k = n.substr(0, n.indexOf('['));
				var a = n.substr(n.indexOf('['));
				if (typeof aFormValues[k] == 'undefined')
					aFormValues[k] = [];
				var p = aFormValues; // pointer reset
				while (a.length != 0) {
					var sa = a.substr(0, a.indexOf(']')+1);

					var lk = k; //save last key
					var lp = p; //save last pointer

					a = a.substr(a.indexOf(']')+1);
					p = p[k];
					k = sa.substr(1, sa.length-2);
					if (k == '') {
						if ('select-multiple' == child.type) {
							k = lk; //restore last key
							p = lp;
						} else {
							k = p.length;
						}
					}
					if (typeof p[k] == 'undefined')
						p[k] = [];
				}
				p[k] = values;
			} else {
				aFormValues[name] = values;
			}
		};
		return this.ManipulateFormData();
	};
})(jQuery);