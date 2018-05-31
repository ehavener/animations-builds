import * as tslib_1 from "tslib";
import { AUTO_STYLE, NoopAnimationPlayer, ɵAnimationGroupPlayer, ɵPRE_STYLE as PRE_STYLE } from '@angular/animations';
export function isBrowser() {
    return (typeof window !== 'undefined' && typeof window.document !== 'undefined');
}
export function optimizeGroupPlayer(players) {
    switch (players.length) {
        case 0:
            return new NoopAnimationPlayer();
        case 1:
            return players[0];
        default:
            return new ɵAnimationGroupPlayer(players);
    }
}
export function normalizeKeyframes(driver, normalizer, element, keyframes, preStyles, postStyles) {
    if (preStyles === void 0) { preStyles = {}; }
    if (postStyles === void 0) { postStyles = {}; }
    var errors = [];
    var normalizedKeyframes = [];
    var previousOffset = -1;
    var previousKeyframe = null;
    keyframes.forEach(function (kf) {
        var offset = kf['offset'];
        var isSameOffset = offset == previousOffset;
        var normalizedKeyframe = (isSameOffset && previousKeyframe) || {};
        Object.keys(kf).forEach(function (prop) {
            var normalizedProp = prop;
            var normalizedValue = kf[prop];
            if (prop !== 'offset') {
                normalizedProp = normalizer.normalizePropertyName(normalizedProp, errors);
                switch (normalizedValue) {
                    case PRE_STYLE:
                        normalizedValue = preStyles[prop];
                        break;
                    case AUTO_STYLE:
                        normalizedValue = postStyles[prop];
                        break;
                    default:
                        normalizedValue =
                            normalizer.normalizeStyleValue(prop, normalizedProp, normalizedValue, errors);
                        break;
                }
            }
            normalizedKeyframe[normalizedProp] = normalizedValue;
        });
        if (!isSameOffset) {
            normalizedKeyframes.push(normalizedKeyframe);
        }
        previousKeyframe = normalizedKeyframe;
        previousOffset = offset;
    });
    if (errors.length) {
        var LINE_START = '\n - ';
        throw new Error("Unable to animate due to the following errors:" + LINE_START + errors.join(LINE_START));
    }
    return normalizedKeyframes;
}
export function listenOnPlayer(player, eventName, event, callback) {
    switch (eventName) {
        case 'start':
            player.onStart(function () { return callback(event && copyAnimationEvent(event, 'start', player)); });
            break;
        case 'done':
            player.onDone(function () { return callback(event && copyAnimationEvent(event, 'done', player)); });
            break;
        case 'destroy':
            player.onDestroy(function () { return callback(event && copyAnimationEvent(event, 'destroy', player)); });
            break;
    }
}
export function copyAnimationEvent(e, phaseName, player) {
    var totalTime = player.totalTime;
    var disabled = player.disabled ? true : false;
    var event = makeAnimationEvent(e.element, e.triggerName, e.fromState, e.toState, phaseName || e.phaseName, totalTime == undefined ? e.totalTime : totalTime, disabled);
    var data = e['_data'];
    if (data != null) {
        event['_data'] = data;
    }
    return event;
}
export function makeAnimationEvent(element, triggerName, fromState, toState, phaseName, totalTime, disabled) {
    if (phaseName === void 0) { phaseName = ''; }
    if (totalTime === void 0) { totalTime = 0; }
    return { element: element, triggerName: triggerName, fromState: fromState, toState: toState, phaseName: phaseName, totalTime: totalTime, disabled: !!disabled };
}
export function getOrSetAsInMap(map, key, defaultValue) {
    var value;
    if (map instanceof Map) {
        value = map.get(key);
        if (!value) {
            map.set(key, value = defaultValue);
        }
    }
    else {
        value = map[key];
        if (!value) {
            value = map[key] = defaultValue;
        }
    }
    return value;
}
export function parseTimelineCommand(command) {
    var separatorPos = command.indexOf(':');
    var id = command.substring(1, separatorPos);
    var action = command.substr(separatorPos + 1);
    return [id, action];
}
var _contains = function (elm1, elm2) { return false; };
var ɵ0 = _contains;
var _matches = function (element, selector) {
    return false;
};
var ɵ1 = _matches;
var _query = function (element, selector, multi) {
    return [];
};
var ɵ2 = _query;
if (isBrowser()) {
    // this is well supported in all browsers
    _contains = function (elm1, elm2) { return elm1.contains(elm2); };
    if (Element.prototype.matches) {
        _matches = function (element, selector) { return element.matches(selector); };
    }
    else {
        var proto = Element.prototype;
        var fn_1 = proto.matchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector ||
            proto.oMatchesSelector || proto.webkitMatchesSelector;
        if (fn_1) {
            _matches = function (element, selector) { return fn_1.apply(element, [selector]); };
        }
    }
    _query = function (element, selector, multi) {
        var results = [];
        if (multi) {
            results.push.apply(results, tslib_1.__spread(element.querySelectorAll(selector)));
        }
        else {
            var elm = element.querySelector(selector);
            if (elm) {
                results.push(elm);
            }
        }
        return results;
    };
}
function containsVendorPrefix(prop) {
    // Webkit is the only real popular vendor prefix nowadays
    // cc: http://shouldiprefix.com/
    return prop.substring(1, 6) == 'ebkit'; // webkit or Webkit
}
var _CACHED_BODY = null;
var _IS_WEBKIT = false;
export function validateStyleProperty(prop) {
    if (!_CACHED_BODY) {
        _CACHED_BODY = getBodyNode() || {};
        _IS_WEBKIT = _CACHED_BODY.style ? ('WebkitAppearance' in _CACHED_BODY.style) : false;
    }
    var result = true;
    if (_CACHED_BODY.style && !containsVendorPrefix(prop)) {
        result = prop in _CACHED_BODY.style;
        if (!result && _IS_WEBKIT) {
            var camelProp = 'Webkit' + prop.charAt(0).toUpperCase() + prop.substr(1);
            result = camelProp in _CACHED_BODY.style;
        }
    }
    return result;
}
export function getBodyNode() {
    if (typeof document != 'undefined') {
        return document.body;
    }
    return null;
}
export var matchesElement = _matches;
export var containsElement = _contains;
export var invokeQuery = _query;
export function hypenatePropsObject(object) {
    var newObj = {};
    Object.keys(object).forEach(function (prop) {
        var newProp = prop.replace(/([a-z])([A-Z])/g, '$1-$2');
        newObj[newProp] = object[prop];
    });
    return newObj;
}
export { ɵ0, ɵ1, ɵ2 };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9icm93c2VyL3NyYy9yZW5kZXIvc2hhcmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFPQSxPQUFPLEVBQUMsVUFBVSxFQUFtQyxtQkFBbUIsRUFBRSxxQkFBcUIsRUFBRSxVQUFVLElBQUksU0FBUyxFQUFhLE1BQU0scUJBQXFCLENBQUM7QUFLakssTUFBTTtJQUNKLE9BQU8sQ0FBQyxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksT0FBTyxNQUFNLENBQUMsUUFBUSxLQUFLLFdBQVcsQ0FBQyxDQUFDO0NBQ2xGO0FBRUQsTUFBTSw4QkFBOEIsT0FBMEI7SUFDNUQsUUFBUSxPQUFPLENBQUMsTUFBTSxFQUFFO1FBQ3RCLEtBQUssQ0FBQztZQUNKLE9BQU8sSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1FBQ25DLEtBQUssQ0FBQztZQUNKLE9BQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BCO1lBQ0UsT0FBTyxJQUFJLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQzdDO0NBQ0Y7QUFFRCxNQUFNLDZCQUNGLE1BQXVCLEVBQUUsVUFBb0MsRUFBRSxPQUFZLEVBQzNFLFNBQXVCLEVBQUUsU0FBMEIsRUFDbkQsVUFBMkI7SUFERiwwQkFBQSxFQUFBLGNBQTBCO0lBQ25ELDJCQUFBLEVBQUEsZUFBMkI7SUFDN0IsSUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO0lBQzVCLElBQU0sbUJBQW1CLEdBQWlCLEVBQUUsQ0FBQztJQUM3QyxJQUFJLGNBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN4QixJQUFJLGdCQUFnQixHQUFvQixJQUFJLENBQUM7SUFDN0MsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEVBQUU7UUFDbEIsSUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FB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LE1BQU0sQ0FBQztDQUNmIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtBVVRPX1NUWUxFLCBBbmltYXRpb25FdmVudCwgQW5pbWF0aW9uUGxheWVyLCBOb29wQW5pbWF0aW9uUGxheWVyLCDJtUFuaW1hdGlvbkdyb3VwUGxheWVyLCDJtVBSRV9TVFlMRSBhcyBQUkVfU1RZTEUsIMm1U3R5bGVEYXRhfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuaW1wb3J0IHtBbmltYXRpb25TdHlsZU5vcm1hbGl6ZXJ9IGZyb20gJy4uLy4uL3NyYy9kc2wvc3R5bGVfbm9ybWFsaXphdGlvbi9hbmltYXRpb25fc3R5bGVfbm9ybWFsaXplcic7XG5pbXBvcnQge0FuaW1hdGlvbkRyaXZlcn0gZnJvbSAnLi4vLi4vc3JjL3JlbmRlci9hbmltYXRpb25fZHJpdmVyJztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzQnJvd3NlcigpIHtcbiAgcmV0dXJuICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2luZG93LmRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvcHRpbWl6ZUdyb3VwUGxheWVyKHBsYXllcnM6IEFuaW1hdGlvblBsYXllcltdKTogQW5pbWF0aW9uUGxheWVyIHtcbiAgc3dpdGNoIChwbGF5ZXJzLmxlbmd0aCkge1xuICAgIGNhc2UgMDpcbiAgICAgIHJldHVybiBuZXcgTm9vcEFuaW1hdGlvblBsYXllcigpO1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiBwbGF5ZXJzWzBdO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbmV3IMm1QW5pbWF0aW9uR3JvdXBQbGF5ZXIocGxheWVycyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUtleWZyYW1lcyhcbiAgICBkcml2ZXI6IEFuaW1hdGlvbkRyaXZlciwgbm9ybWFsaXplcjogQW5pbWF0aW9uU3R5bGVOb3JtYWxpemVyLCBlbGVtZW50OiBhbnksXG4gICAga2V5ZnJhbWVzOiDJtVN0eWxlRGF0YVtdLCBwcmVTdHlsZXM6IMm1U3R5bGVEYXRhID0ge30sXG4gICAgcG9zdFN0eWxlczogybVTdHlsZURhdGEgPSB7fSk6IMm1U3R5bGVEYXRhW10ge1xuICBjb25zdCBlcnJvcnM6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IG5vcm1hbGl6ZWRLZXlmcmFtZXM6IMm1U3R5bGVEYXRhW10gPSBbXTtcbiAgbGV0IHByZXZpb3VzT2Zmc2V0ID0gLTE7XG4gIGxldCBwcmV2aW91c0tleWZyYW1lOiDJtVN0eWxlRGF0YXxudWxsID0gbnVsbDtcbiAga2V5ZnJhbWVzLmZvckVhY2goa2YgPT4ge1xuICAgIGNvbnN0IG9mZnNldCA9IGtmWydvZmZzZXQnXSBhcyBudW1iZXI7XG4gICAgY29uc3QgaXNTYW1lT2Zmc2V0ID0gb2Zmc2V0ID09IHByZXZpb3VzT2Zmc2V0O1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRLZXlmcmFtZTogybVTdHlsZURhdGEgPSAoaXNTYW1lT2Zmc2V0ICYmIHByZXZpb3VzS2V5ZnJhbWUpIHx8IHt9O1xuICAgIE9iamVjdC5rZXlzKGtmKS5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgbGV0IG5vcm1hbGl6ZWRQcm9wID0gcHJvcDtcbiAgICAgIGxldCBub3JtYWxpemVkVmFsdWUgPSBrZltwcm9wXTtcbiAgICAgIGlmIChwcm9wICE9PSAnb2Zmc2V0Jykge1xuICAgICAgICBub3JtYWxpemVkUHJvcCA9IG5vcm1hbGl6ZXIubm9ybWFsaXplUHJvcGVydHlOYW1lKG5vcm1hbGl6ZWRQcm9wLCBlcnJvcnMpO1xuICAgICAgICBzd2l0Y2ggKG5vcm1hbGl6ZWRWYWx1ZSkge1xuICAgICAgICAgIGNhc2UgUFJFX1NUWUxFOlxuICAgICAgICAgICAgbm9ybWFsaXplZFZhbHVlID0gcHJlU3R5bGVzW3Byb3BdO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIEFVVE9fU1RZTEU6XG4gICAgICAgICAgICBub3JtYWxpemVkVmFsdWUgPSBwb3N0U3R5bGVzW3Byb3BdO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgbm9ybWFsaXplZFZhbHVlID1cbiAgICAgICAgICAgICAgICBub3JtYWxpemVyLm5vcm1hbGl6ZVN0eWxlVmFsdWUocHJvcCwgbm9ybWFsaXplZFByb3AsIG5vcm1hbGl6ZWRWYWx1ZSwgZXJyb3JzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBub3JtYWxpemVkS2V5ZnJhbWVbbm9ybWFsaXplZFByb3BdID0gbm9ybWFsaXplZFZhbHVlO1xuICAgIH0pO1xuICAgIGlmICghaXNTYW1lT2Zmc2V0KSB7XG4gICAgICBub3JtYWxpemVkS2V5ZnJhbWVzLnB1c2gobm9ybWFsaXplZEtleWZyYW1lKTtcbiAgICB9XG4gICAgcHJldmlvdXNLZXlmcmFtZSA9IG5vcm1hbGl6ZWRLZXlmcmFtZTtcbiAgICBwcmV2aW91c09mZnNldCA9IG9mZnNldDtcbiAgfSk7XG4gIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgY29uc3QgTElORV9TVEFSVCA9ICdcXG4gLSAnO1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYFVuYWJsZSB0byBhbmltYXRlIGR1ZSB0byB0aGUgZm9sbG93aW5nIGVycm9yczoke0xJTkVfU1RBUlR9JHtlcnJvcnMuam9pbihMSU5FX1NUQVJUKX1gKTtcbiAgfVxuXG4gIHJldHVybiBub3JtYWxpemVkS2V5ZnJhbWVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGlzdGVuT25QbGF5ZXIoXG4gICAgcGxheWVyOiBBbmltYXRpb25QbGF5ZXIsIGV2ZW50TmFtZTogc3RyaW5nLCBldmVudDogQW5pbWF0aW9uRXZlbnQgfCB1bmRlZmluZWQsXG4gICAgY2FsbGJhY2s6IChldmVudDogYW55KSA9PiBhbnkpIHtcbiAgc3dpdGNoIChldmVudE5hbWUpIHtcbiAgICBjYXNlICdzdGFydCc6XG4gICAgICBwbGF5ZXIub25TdGFydCgoKSA9PiBjYWxsYmFjayhldmVudCAmJiBjb3B5QW5pbWF0aW9uRXZlbnQoZXZlbnQsICdzdGFydCcsIHBsYXllcikpKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2RvbmUnOlxuICAgICAgcGxheWVyLm9uRG9uZSgoKSA9PiBjYWxsYmFjayhldmVudCAmJiBjb3B5QW5pbWF0aW9uRXZlbnQoZXZlbnQsICdkb25lJywgcGxheWVyKSkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnZGVzdHJveSc6XG4gICAgICBwbGF5ZXIub25EZXN0cm95KCgpID0+IGNhbGxiYWNrKGV2ZW50ICYmIGNvcHlBbmltYXRpb25FdmVudChldmVudCwgJ2Rlc3Ryb3knLCBwbGF5ZXIpKSk7XG4gICAgICBicmVhaztcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29weUFuaW1hdGlvbkV2ZW50KFxuICAgIGU6IEFuaW1hdGlvbkV2ZW50LCBwaGFzZU5hbWU6IHN0cmluZywgcGxheWVyOiBBbmltYXRpb25QbGF5ZXIpOiBBbmltYXRpb25FdmVudCB7XG4gIGNvbnN0IHRvdGFsVGltZSA9IHBsYXllci50b3RhbFRpbWU7XG4gIGNvbnN0IGRpc2FibGVkID0gKHBsYXllciBhcyBhbnkpLmRpc2FibGVkID8gdHJ1ZSA6IGZhbHNlO1xuICBjb25zdCBldmVudCA9IG1ha2VBbmltYXRpb25FdmVudChcbiAgICAgIGUuZWxlbWVudCwgZS50cmlnZ2VyTmFtZSwgZS5mcm9tU3RhdGUsIGUudG9TdGF0ZSwgcGhhc2VOYW1lIHx8IGUucGhhc2VOYW1lLFxuICAgICAgdG90YWxUaW1lID09IHVuZGVmaW5lZCA/IGUudG90YWxUaW1lIDogdG90YWxUaW1lLCBkaXNhYmxlZCk7XG4gIGNvbnN0IGRhdGEgPSAoZSBhcyBhbnkpWydfZGF0YSddO1xuICBpZiAoZGF0YSAhPSBudWxsKSB7XG4gICAgKGV2ZW50IGFzIGFueSlbJ19kYXRhJ10gPSBkYXRhO1xuICB9XG4gIHJldHVybiBldmVudDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VBbmltYXRpb25FdmVudChcbiAgICBlbGVtZW50OiBhbnksIHRyaWdnZXJOYW1lOiBzdHJpbmcsIGZyb21TdGF0ZTogc3RyaW5nLCB0b1N0YXRlOiBzdHJpbmcsIHBoYXNlTmFtZTogc3RyaW5nID0gJycsXG4gICAgdG90YWxUaW1lOiBudW1iZXIgPSAwLCBkaXNhYmxlZD86IGJvb2xlYW4pOiBBbmltYXRpb25FdmVudCB7XG4gIHJldHVybiB7ZWxlbWVudCwgdHJpZ2dlck5hbWUsIGZyb21TdGF0ZSwgdG9TdGF0ZSwgcGhhc2VOYW1lLCB0b3RhbFRpbWUsIGRpc2FibGVkOiAhIWRpc2FibGVkfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE9yU2V0QXNJbk1hcChcbiAgICBtYXA6IE1hcDxhbnksIGFueT58IHtba2V5OiBzdHJpbmddOiBhbnl9LCBrZXk6IGFueSwgZGVmYXVsdFZhbHVlOiBhbnkpIHtcbiAgbGV0IHZhbHVlOiBhbnk7XG4gIGlmIChtYXAgaW5zdGFuY2VvZiBNYXApIHtcbiAgICB2YWx1ZSA9IG1hcC5nZXQoa2V5KTtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICBtYXAuc2V0KGtleSwgdmFsdWUgPSBkZWZhdWx0VmFsdWUpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YWx1ZSA9IG1hcFtrZXldO1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgIHZhbHVlID0gbWFwW2tleV0gPSBkZWZhdWx0VmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVGltZWxpbmVDb21tYW5kKGNvbW1hbmQ6IHN0cmluZyk6IFtzdHJpbmcsIHN0cmluZ10ge1xuICBjb25zdCBzZXBhcmF0b3JQb3MgPSBjb21tYW5kLmluZGV4T2YoJzonKTtcbiAgY29uc3QgaWQgPSBjb21tYW5kLnN1YnN0cmluZygxLCBzZXBhcmF0b3JQb3MpO1xuICBjb25zdCBhY3Rpb24gPSBjb21tYW5kLnN1YnN0cihzZXBhcmF0b3JQb3MgKyAxKTtcbiAgcmV0dXJuIFtpZCwgYWN0aW9uXTtcbn1cblxubGV0IF9jb250YWluczogKGVsbTE6IGFueSwgZWxtMjogYW55KSA9PiBib29sZWFuID0gKGVsbTE6IGFueSwgZWxtMjogYW55KSA9PiBmYWxzZTtcbmxldCBfbWF0Y2hlczogKGVsZW1lbnQ6IGFueSwgc2VsZWN0b3I6IHN0cmluZykgPT4gYm9vbGVhbiA9IChlbGVtZW50OiBhbnksIHNlbGVjdG9yOiBzdHJpbmcpID0+XG4gICAgZmFsc2U7XG5sZXQgX3F1ZXJ5OiAoZWxlbWVudDogYW55LCBzZWxlY3Rvcjogc3RyaW5nLCBtdWx0aTogYm9vbGVhbikgPT4gYW55W10gPVxuICAgIChlbGVtZW50OiBhbnksIHNlbGVjdG9yOiBzdHJpbmcsIG11bHRpOiBib29sZWFuKSA9PiB7XG4gICAgICByZXR1cm4gW107XG4gICAgfTtcblxuaWYgKGlzQnJvd3NlcigpKSB7XG4gIC8vIHRoaXMgaXMgd2VsbCBzdXBwb3J0ZWQgaW4gYWxsIGJyb3dzZXJzXG4gIF9jb250YWlucyA9IChlbG0xOiBhbnksIGVsbTI6IGFueSkgPT4geyByZXR1cm4gZWxtMS5jb250YWlucyhlbG0yKSBhcyBib29sZWFuOyB9O1xuXG4gIGlmIChFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzKSB7XG4gICAgX21hdGNoZXMgPSAoZWxlbWVudDogYW55LCBzZWxlY3Rvcjogc3RyaW5nKSA9PiBlbGVtZW50Lm1hdGNoZXMoc2VsZWN0b3IpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHByb3RvID0gRWxlbWVudC5wcm90b3R5cGUgYXMgYW55O1xuICAgIGNvbnN0IGZuID0gcHJvdG8ubWF0Y2hlc1NlbGVjdG9yIHx8IHByb3RvLm1vek1hdGNoZXNTZWxlY3RvciB8fCBwcm90by5tc01hdGNoZXNTZWxlY3RvciB8fFxuICAgICAgICBwcm90by5vTWF0Y2hlc1NlbGVjdG9yIHx8IHByb3RvLndlYmtpdE1hdGNoZXNTZWxlY3RvcjtcbiAgICBpZiAoZm4pIHtcbiAgICAgIF9tYXRjaGVzID0gKGVsZW1lbnQ6IGFueSwgc2VsZWN0b3I6IHN0cmluZykgPT4gZm4uYXBwbHkoZWxlbWVudCwgW3NlbGVjdG9yXSk7XG4gICAgfVxuICB9XG5cbiAgX3F1ZXJ5ID0gKGVsZW1lbnQ6IGFueSwgc2VsZWN0b3I6IHN0cmluZywgbXVsdGk6IGJvb2xlYW4pOiBhbnlbXSA9PiB7XG4gICAgbGV0IHJlc3VsdHM6IGFueVtdID0gW107XG4gICAgaWYgKG11bHRpKSB7XG4gICAgICByZXN1bHRzLnB1c2goLi4uZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGVsbSA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgICBpZiAoZWxtKSB7XG4gICAgICAgIHJlc3VsdHMucHVzaChlbG0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcbn1cblxuZnVuY3Rpb24gY29udGFpbnNWZW5kb3JQcmVmaXgocHJvcDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIC8vIFdlYmtpdCBpcyB0aGUgb25seSByZWFsIHBvcHVsYXIgdmVuZG9yIHByZWZpeCBub3dhZGF5c1xuICAvLyBjYzogaHR0cDovL3Nob3VsZGlwcmVmaXguY29tL1xuICByZXR1cm4gcHJvcC5zdWJzdHJpbmcoMSwgNikgPT0gJ2Via2l0JzsgIC8vIHdlYmtpdCBvciBXZWJraXRcbn1cblxubGV0IF9DQUNIRURfQk9EWToge3N0eWxlOiBhbnl9fG51bGwgPSBudWxsO1xubGV0IF9JU19XRUJLSVQgPSBmYWxzZTtcbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVN0eWxlUHJvcGVydHkocHJvcDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGlmICghX0NBQ0hFRF9CT0RZKSB7XG4gICAgX0NBQ0hFRF9CT0RZID0gZ2V0Qm9keU5vZGUoKSB8fCB7fTtcbiAgICBfSVNfV0VCS0lUID0gX0NBQ0hFRF9CT0RZICEuc3R5bGUgPyAoJ1dlYmtpdEFwcGVhcmFuY2UnIGluIF9DQUNIRURfQk9EWSAhLnN0eWxlKSA6IGZhbHNlO1xuICB9XG5cbiAgbGV0IHJlc3VsdCA9IHRydWU7XG4gIGlmIChfQ0FDSEVEX0JPRFkgIS5zdHlsZSAmJiAhY29udGFpbnNWZW5kb3JQcmVmaXgocHJvcCkpIHtcbiAgICByZXN1bHQgPSBwcm9wIGluIF9DQUNIRURfQk9EWSAhLnN0eWxlO1xuICAgIGlmICghcmVzdWx0ICYmIF9JU19XRUJLSVQpIHtcbiAgICAgIGNvbnN0IGNhbWVsUHJvcCA9ICdXZWJraXQnICsgcHJvcC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHByb3Auc3Vic3RyKDEpO1xuICAgICAgcmVzdWx0ID0gY2FtZWxQcm9wIGluIF9DQUNIRURfQk9EWSAhLnN0eWxlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRCb2R5Tm9kZSgpOiBhbnl8bnVsbCB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuYm9keTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGNvbnN0IG1hdGNoZXNFbGVtZW50ID0gX21hdGNoZXM7XG5leHBvcnQgY29uc3QgY29udGFpbnNFbGVtZW50ID0gX2NvbnRhaW5zO1xuZXhwb3J0IGNvbnN0IGludm9rZVF1ZXJ5ID0gX3F1ZXJ5O1xuXG5leHBvcnQgZnVuY3Rpb24gaHlwZW5hdGVQcm9wc09iamVjdChvYmplY3Q6IHtba2V5OiBzdHJpbmddOiBhbnl9KToge1trZXk6IHN0cmluZ106IGFueX0ge1xuICBjb25zdCBuZXdPYmo6IHtba2V5OiBzdHJpbmddOiBhbnl9ID0ge307XG4gIE9iamVjdC5rZXlzKG9iamVjdCkuZm9yRWFjaChwcm9wID0+IHtcbiAgICBjb25zdCBuZXdQcm9wID0gcHJvcC5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEtJDInKTtcbiAgICBuZXdPYmpbbmV3UHJvcF0gPSBvYmplY3RbcHJvcF07XG4gIH0pO1xuICByZXR1cm4gbmV3T2JqO1xufVxuIl19