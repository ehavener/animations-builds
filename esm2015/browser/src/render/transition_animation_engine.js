/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { AUTO_STYLE, NoopAnimationPlayer, ɵAnimationGroupPlayer as AnimationGroupPlayer, ɵPRE_STYLE as PRE_STYLE } from '@angular/animations';
import { ElementInstructionMap } from '../dsl/element_instruction_map';
import { ENTER_CLASSNAME, LEAVE_CLASSNAME, NG_ANIMATING_CLASSNAME, NG_ANIMATING_SELECTOR, NG_TRIGGER_CLASSNAME, NG_TRIGGER_SELECTOR, copyObj, eraseStyles, setStyles } from '../util';
import { getOrSetAsInMap, listenOnPlayer, makeAnimationEvent, normalizeKeyframes, optimizeGroupPlayer } from './shared';
const /** @type {?} */ QUEUED_CLASSNAME = 'ng-animate-queued';
const /** @type {?} */ QUEUED_SELECTOR = '.ng-animate-queued';
const /** @type {?} */ DISABLED_CLASSNAME = 'ng-animate-disabled';
const /** @type {?} */ DISABLED_SELECTOR = '.ng-animate-disabled';
const /** @type {?} */ STAR_CLASSNAME = 'ng-star-inserted';
const /** @type {?} */ STAR_SELECTOR = '.ng-star-inserted';
const /** @type {?} */ EMPTY_PLAYER_ARRAY = [];
const /** @type {?} */ NULL_REMOVAL_STATE = {
    namespaceId: '',
    setForRemoval: false,
    setForMove: false,
    hasAnimation: false,
    removedBeforeQueried: false
};
const /** @type {?} */ NULL_REMOVED_QUERIED_STATE = {
    namespaceId: '',
    setForMove: false,
    setForRemoval: false,
    hasAnimation: false,
    removedBeforeQueried: true
};
/**
 * @record
 */
function TriggerListener() { }
function TriggerListener_tsickle_Closure_declarations() {
    /** @type {?} */
    TriggerListener.prototype.name;
    /** @type {?} */
    TriggerListener.prototype.phase;
    /** @type {?} */
    TriggerListener.prototype.callback;
}
/**
 * @record
 */
export function QueueInstruction() { }
function QueueInstruction_tsickle_Closure_declarations() {
    /** @type {?} */
    QueueInstruction.prototype.element;
    /** @type {?} */
    QueueInstruction.prototype.triggerName;
    /** @type {?} */
    QueueInstruction.prototype.fromState;
    /** @type {?} */
    QueueInstruction.prototype.toState;
    /** @type {?} */
    QueueInstruction.prototype.transition;
    /** @type {?} */
    QueueInstruction.prototype.player;
    /** @type {?} */
    QueueInstruction.prototype.isFallbackTransition;
}
export const /** @type {?} */ REMOVAL_FLAG = '__ng_removed';
/**
 * @record
 */
export function ElementAnimationState() { }
function ElementAnimationState_tsickle_Closure_declarations() {
    /** @type {?} */
    ElementAnimationState.prototype.setForRemoval;
    /** @type {?} */
    ElementAnimationState.prototype.setForMove;
    /** @type {?} */
    ElementAnimationState.prototype.hasAnimation;
    /** @type {?} */
    ElementAnimationState.prototype.namespaceId;
    /** @type {?} */
    ElementAnimationState.prototype.removedBeforeQueried;
}
export class StateValue {
    /**
     * @param {?} input
     * @param {?=} namespaceId
     */
    constructor(input, namespaceId = '') {
        this.namespaceId = namespaceId;
        const /** @type {?} */ isObj = input && input.hasOwnProperty('value');
        const /** @type {?} */ value = isObj ? input['value'] : input;
        this.value = normalizeTriggerValue(value);
        if (isObj) {
            const /** @type {?} */ options = copyObj(/** @type {?} */ (input));
            delete options['value'];
            this.options = /** @type {?} */ (options);
        }
        else {
            this.options = {};
        }
        if (!this.options.params) {
            this.options.params = {};
        }
    }
    /**
     * @return {?}
     */
    get params() { return /** @type {?} */ (this.options.params); }
    /**
     * @param {?} options
     * @return {?}
     */
    absorbOptions(options) {
        const /** @type {?} */ newParams = options.params;
        if (newParams) {
            const /** @type {?} */ oldParams = /** @type {?} */ ((this.options.params));
            Object.keys(newParams).forEach(prop => {
                if (oldParams[prop] == null) {
                    oldParams[prop] = newParams[prop];
                }
            });
        }
    }
}
function StateValue_tsickle_Closure_declarations() {
    /** @type {?} */
    StateValue.prototype.value;
    /** @type {?} */
    StateValue.prototype.options;
    /** @type {?} */
    StateValue.prototype.namespaceId;
}
export const /** @type {?} */ VOID_VALUE = 'void';
export const /** @type {?} */ DEFAULT_STATE_VALUE = new StateValue(VOID_VALUE);
export class AnimationTransitionNamespace {
    /**
     * @param {?} id
     * @param {?} hostElement
     * @param {?} _engine
     */
    constructor(id, hostElement, _engine) {
        this.id = id;
        this.hostElement = hostElement;
        this._engine = _engine;
        this.players = [];
        this._triggers = {};
        this._queue = [];
        this._elementListeners = new Map();
        this._hostClassName = 'ng-tns-' + id;
        addClass(hostElement, this._hostClassName);
    }
    /**
     * @param {?} element
     * @param {?} name
     * @param {?} phase
     * @param {?} callback
     * @return {?}
     */
    listen(element, name, phase, callback) {
        if (!this._triggers.hasOwnProperty(name)) {
            throw new Error(`Unable to listen on the animation trigger event "${phase}" because the animation trigger "${name}" doesn\'t exist!`);
        }
        if (phase == null || phase.length == 0) {
            throw new Error(`Unable to listen on the animation trigger "${name}" because the provided event is undefined!`);
        }
        if (!isTriggerEventValid(phase)) {
            throw new Error(`The provided animation trigger event "${phase}" for the animation trigger "${name}" is not supported!`);
        }
        const /** @type {?} */ listeners = getOrSetAsInMap(this._elementListeners, element, []);
        const /** @type {?} */ data = { name, phase, callback };
        listeners.push(data);
        const /** @type {?} */ triggersWithStates = getOrSetAsInMap(this._engine.statesByElement, element, {});
        if (!triggersWithStates.hasOwnProperty(name)) {
            addClass(element, NG_TRIGGER_CLASSNAME);
            addClass(element, NG_TRIGGER_CLASSNAME + '-' + name);
            triggersWithStates[name] = DEFAULT_STATE_VALUE;
        }
        return () => {
            // the event listener is removed AFTER the flush has occurred such
            // that leave animations callbacks can fire (otherwise if the node
            // is removed in between then the listeners would be deregistered)
            this._engine.afterFlush(() => {
                const /** @type {?} */ index = listeners.indexOf(data);
                if (index >= 0) {
                    listeners.splice(index, 1);
                }
                if (!this._triggers[name]) {
                    delete triggersWithStates[name];
                }
            });
        };
    }
    /**
     * @param {?} name
     * @param {?} ast
     * @return {?}
     */
    register(name, ast) {
        if (this._triggers[name]) {
            // throw
            return false;
        }
        else {
            this._triggers[name] = ast;
            return true;
        }
    }
    /**
     * @param {?} name
     * @return {?}
     */
    _getTrigger(name) {
        const /** @type {?} */ trigger = this._triggers[name];
        if (!trigger) {
            throw new Error(`The provided animation trigger "${name}" has not been registered!`);
        }
        return trigger;
    }
    /**
     * @param {?} element
     * @param {?} triggerName
     * @param {?} value
     * @param {?=} defaultToFallback
     * @return {?}
     */
    trigger(element, triggerName, value, defaultToFallback = true) {
        const /** @type {?} */ trigger = this._getTrigger(triggerName);
        const /** @type {?} */ player = new TransitionAnimationPlayer(this.id, triggerName, element);
        let /** @type {?} */ triggersWithStates = this._engine.statesByElement.get(element);
        if (!triggersWithStates) {
            addClass(element, NG_TRIGGER_CLASSNAME);
            addClass(element, NG_TRIGGER_CLASSNAME + '-' + triggerName);
            this._engine.statesByElement.set(element, triggersWithStates = {});
        }
        let /** @type {?} */ fromState = triggersWithStates[triggerName];
        const /** @type {?} */ toState = new StateValue(value, this.id);
        const /** @type {?} */ isObj = value && value.hasOwnProperty('value');
        if (!isObj && fromState) {
            toState.absorbOptions(fromState.options);
        }
        triggersWithStates[triggerName] = toState;
        if (!fromState) {
            fromState = DEFAULT_STATE_VALUE;
        }
        const /** @type {?} */ isRemoval = toState.value === VOID_VALUE;
        // normally this isn't reached by here, however, if an object expression
        // is passed in then it may be a new object each time. Comparing the value
        // is important since that will stay the same despite there being a new object.
        // The removal arc here is special cased because the same element is triggered
        // twice in the event that it contains animations on the outer/inner portions
        // of the host container
        if (!isRemoval && fromState.value === toState.value) {
            // this means that despite the value not changing, some inner params
            // have changed which means that the animation final styles need to be applied
            if (!objEquals(fromState.params, toState.params)) {
                const /** @type {?} */ errors = [];
                const /** @type {?} */ fromStyles = trigger.matchStyles(fromState.value, fromState.params, errors);
                const /** @type {?} */ toStyles = trigger.matchStyles(toState.value, toState.params, errors);
                if (errors.length) {
                    this._engine.reportError(errors);
                }
                else {
                    this._engine.afterFlush(() => {
                        eraseStyles(element, fromStyles);
                        setStyles(element, toStyles);
                    });
                }
            }
            return;
        }
        const /** @type {?} */ playersOnElement = getOrSetAsInMap(this._engine.playersByElement, element, []);
        playersOnElement.forEach(player => {
            // only remove the player if it is queued on the EXACT same trigger/namespace
            // we only also deal with queued players here because if the animation has
            // started then we want to keep the player alive until the flush happens
            // (which is where the previousPlayers are passed into the new palyer)
            if (player.namespaceId == this.id && player.triggerName == triggerName && player.queued) {
                player.destroy();
            }
        });
        let /** @type {?} */ transition = trigger.matchTransition(fromState.value, toState.value, element, toState.params);
        let /** @type {?} */ isFallbackTransition = false;
        if (!transition) {
            if (!defaultToFallback)
                return;
            transition = trigger.fallbackTransition;
            isFallbackTransition = true;
        }
        this._engine.totalQueuedPlayers++;
        this._queue.push({ element, triggerName, transition, fromState, toState, player, isFallbackTransition });
        if (!isFallbackTransition) {
            addClass(element, QUEUED_CLASSNAME);
            player.onStart(() => { removeClass(element, QUEUED_CLASSNAME); });
        }
        player.onDone(() => {
            let /** @type {?} */ index = this.players.indexOf(player);
            if (index >= 0) {
                this.players.splice(index, 1);
            }
            const /** @type {?} */ players = this._engine.playersByElement.get(element);
            if (players) {
                let /** @type {?} */ index = players.indexOf(player);
                if (index >= 0) {
                    players.splice(index, 1);
                }
            }
        });
        this.players.push(player);
        playersOnElement.push(player);
        return player;
    }
    /**
     * @param {?} name
     * @return {?}
     */
    deregister(name) {
        delete this._triggers[name];
        this._engine.statesByElement.forEach((stateMap, element) => { delete stateMap[name]; });
        this._elementListeners.forEach((listeners, element) => {
            this._elementListeners.set(element, listeners.filter(entry => { return entry.name != name; }));
        });
    }
    /**
     * @param {?} element
     * @return {?}
     */
    clearElementCache(element) {
        this._engine.statesByElement.delete(element);
        this._elementListeners.delete(element);
        const /** @type {?} */ elementPlayers = this._engine.playersByElement.get(element);
        if (elementPlayers) {
            elementPlayers.forEach(player => player.destroy());
            this._engine.playersByElement.delete(element);
        }
    }
    /**
     * @param {?} rootElement
     * @param {?} context
     * @param {?=} animate
     * @return {?}
     */
    _signalRemovalForInnerTriggers(rootElement, context, animate = false) {
        // emulate a leave animation for all inner nodes within this node.
        // If there are no animations found for any of the nodes then clear the cache
        // for the element.
        this._engine.driver.query(rootElement, NG_TRIGGER_SELECTOR, true).forEach(elm => {
            // this means that an inner remove() operation has already kicked off
            // the animation on this element...
            if (elm[REMOVAL_FLAG])
                return;
            const /** @type {?} */ namespaces = this._engine.fetchNamespacesByElement(elm);
            if (namespaces.size) {
                namespaces.forEach(ns => ns.triggerLeaveAnimation(elm, context, false, true));
            }
            else {
                this.clearElementCache(elm);
            }
        });
    }
    /**
     * @param {?} element
     * @param {?} context
     * @param {?=} destroyAfterComplete
     * @param {?=} defaultToFallback
     * @return {?}
     */
    triggerLeaveAnimation(element, context, destroyAfterComplete, defaultToFallback) {
        const /** @type {?} */ triggerStates = this._engine.statesByElement.get(element);
        if (triggerStates) {
            const /** @type {?} */ players = [];
            Object.keys(triggerStates).forEach(triggerName => {
                // this check is here in the event that an element is removed
                // twice (both on the host level and the component level)
                if (this._triggers[triggerName]) {
                    const /** @type {?} */ player = this.trigger(element, triggerName, VOID_VALUE, defaultToFallback);
                    if (player) {
                        players.push(player);
                    }
                }
            });
            if (players.length) {
                this._engine.markElementAsRemoved(this.id, element, true, context);
                if (destroyAfterComplete) {
                    optimizeGroupPlayer(players).onDone(() => this._engine.processLeaveNode(element));
                }
                return true;
            }
        }
        return false;
    }
    /**
     * @param {?} element
     * @return {?}
     */
    prepareLeaveAnimationListeners(element) {
        const /** @type {?} */ listeners = this._elementListeners.get(element);
        if (listeners) {
            const /** @type {?} */ visitedTriggers = new Set();
            listeners.forEach(listener => {
                const /** @type {?} */ triggerName = listener.name;
                if (visitedTriggers.has(triggerName))
                    return;
                visitedTriggers.add(triggerName);
                const /** @type {?} */ trigger = this._triggers[triggerName];
                const /** @type {?} */ transition = trigger.fallbackTransition;
                const /** @type {?} */ elementStates = /** @type {?} */ ((this._engine.statesByElement.get(element)));
                const /** @type {?} */ fromState = elementStates[triggerName] || DEFAULT_STATE_VALUE;
                const /** @type {?} */ toState = new StateValue(VOID_VALUE);
                const /** @type {?} */ player = new TransitionAnimationPlayer(this.id, triggerName, element);
                this._engine.totalQueuedPlayers++;
                this._queue.push({
                    element,
                    triggerName,
                    transition,
                    fromState,
                    toState,
                    player,
                    isFallbackTransition: true
                });
            });
        }
    }
    /**
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    removeNode(element, context) {
        const /** @type {?} */ engine = this._engine;
        if (element.childElementCount) {
            this._signalRemovalForInnerTriggers(element, context, true);
        }
        // this means that a * => VOID animation was detected and kicked off
        if (this.triggerLeaveAnimation(element, context, true))
            return;
        // find the player that is animating and make sure that the
        // removal is delayed until that player has completed
        let /** @type {?} */ containsPotentialParentTransition = false;
        if (engine.totalAnimations) {
            const /** @type {?} */ currentPlayers = engine.players.length ? engine.playersByQueriedElement.get(element) : [];
            // when this `if statement` does not continue forward it means that
            // a previous animation query has selected the current element and
            // is animating it. In this situation want to continue forwards and
            // allow the element to be queued up for animation later.
            if (currentPlayers && currentPlayers.length) {
                containsPotentialParentTransition = true;
            }
            else {
                let /** @type {?} */ parent = element;
                while (parent = parent.parentNode) {
                    const /** @type {?} */ triggers = engine.statesByElement.get(parent);
                    if (triggers) {
                        containsPotentialParentTransition = true;
                        break;
                    }
                }
            }
        }
        // at this stage we know that the element will either get removed
        // during flush or will be picked up by a parent query. Either way
        // we need to fire the listeners for this element when it DOES get
        // removed (once the query parent animation is done or after flush)
        this.prepareLeaveAnimationListeners(element);
        // whether or not a parent has an animation we need to delay the deferral of the leave
        // operation until we have more information (which we do after flush() has been called)
        if (containsPotentialParentTransition) {
            engine.markElementAsRemoved(this.id, element, false, context);
        }
        else {
            // we do this after the flush has occurred such
            // that the callbacks can be fired
            engine.afterFlush(() => this.clearElementCache(element));
            engine.destroyInnerAnimations(element);
            engine._onRemovalComplete(element, context);
        }
    }
    /**
     * @param {?} element
     * @param {?} parent
     * @return {?}
     */
    insertNode(element, parent) { addClass(element, this._hostClassName); }
    /**
     * @param {?} microtaskId
     * @return {?}
     */
    drainQueuedTransitions(microtaskId) {
        const /** @type {?} */ instructions = [];
        this._queue.forEach(entry => {
            const /** @type {?} */ player = entry.player;
            if (player.destroyed)
                return;
            const /** @type {?} */ element = entry.element;
            const /** @type {?} */ listeners = this._elementListeners.get(element);
            if (listeners) {
                listeners.forEach((listener) => {
                    if (listener.name == entry.triggerName) {
                        const /** @type {?} */ baseEvent = makeAnimationEvent(element, entry.triggerName, entry.fromState.value, entry.toState.value);
                        (/** @type {?} */ (baseEvent))['_data'] = microtaskId;
                        listenOnPlayer(entry.player, listener.phase, baseEvent, listener.callback);
                    }
                });
            }
            if (player.markedForDestroy) {
                this._engine.afterFlush(() => {
                    // now we can destroy the element properly since the event listeners have
                    // been bound to the player
                    player.destroy();
                });
            }
            else {
                instructions.push(entry);
            }
        });
        this._queue = [];
        return instructions.sort((a, b) => {
            // if depCount == 0 them move to front
            // otherwise if a contains b then move back
            const /** @type {?} */ d0 = a.transition.ast.depCount;
            const /** @type {?} */ d1 = b.transition.ast.depCount;
            if (d0 == 0 || d1 == 0) {
                return d0 - d1;
            }
            return this._engine.driver.containsElement(a.element, b.element) ? 1 : -1;
        });
    }
    /**
     * @param {?} context
     * @return {?}
     */
    destroy(context) {
        this.players.forEach(p => p.destroy());
        this._signalRemovalForInnerTriggers(this.hostElement, context);
    }
    /**
     * @param {?} element
     * @return {?}
     */
    elementContainsData(element) {
        let /** @type {?} */ containsData = false;
        if (this._elementListeners.has(element))
            containsData = true;
        containsData =
            (this._queue.find(entry => entry.element === element) ? true : false) || containsData;
        return containsData;
    }
}
function AnimationTransitionNamespace_tsickle_Closure_declarations() {
    /** @type {?} */
    AnimationTransitionNamespace.prototype.players;
    /** @type {?} */
    AnimationTransitionNamespace.prototype._triggers;
    /** @type {?} */
    AnimationTransitionNamespace.prototype._queue;
    /** @type {?} */
    AnimationTransitionNamespace.prototype._elementListeners;
    /** @type {?} */
    AnimationTransitionNamespace.prototype._hostClassName;
    /** @type {?} */
    AnimationTransitionNamespace.prototype.id;
    /** @type {?} */
    AnimationTransitionNamespace.prototype.hostElement;
    /** @type {?} */
    AnimationTransitionNamespace.prototype._engine;
}
/**
 * @record
 */
export function QueuedTransition() { }
function QueuedTransition_tsickle_Closure_declarations() {
    /** @type {?} */
    QueuedTransition.prototype.element;
    /** @type {?} */
    QueuedTransition.prototype.instruction;
    /** @type {?} */
    QueuedTransition.prototype.player;
}
export class TransitionAnimationEngine {
    /**
     * @param {?} bodyNode
     * @param {?} driver
     * @param {?} _normalizer
     */
    constructor(bodyNode, driver, _normalizer) {
        this.bodyNode = bodyNode;
        this.driver = driver;
        this._normalizer = _normalizer;
        this.players = [];
        this.newHostElements = new Map();
        this.playersByElement = new Map();
        this.playersByQueriedElement = new Map();
        this.statesByElement = new Map();
        this.disabledNodes = new Set();
        this.totalAnimations = 0;
        this.totalQueuedPlayers = 0;
        this._namespaceLookup = {};
        this._namespaceList = [];
        this._flushFns = [];
        this._whenQuietFns = [];
        this.namespacesByHostElement = new Map();
        this.collectedEnterElements = [];
        this.collectedLeaveElements = [];
        this.onRemovalComplete = (element, context) => { };
    }
    /**
     * \@internal
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    _onRemovalComplete(element, context) { this.onRemovalComplete(element, context); }
    /**
     * @return {?}
     */
    get queuedPlayers() {
        const /** @type {?} */ players = [];
        this._namespaceList.forEach(ns => {
            ns.players.forEach(player => {
                if (player.queued) {
                    players.push(player);
                }
            });
        });
        return players;
    }
    /**
     * @param {?} namespaceId
     * @param {?} hostElement
     * @return {?}
     */
    createNamespace(namespaceId, hostElement) {
        const /** @type {?} */ ns = new AnimationTransitionNamespace(namespaceId, hostElement, this);
        if (hostElement.parentNode) {
            this._balanceNamespaceList(ns, hostElement);
        }
        else {
            // defer this later until flush during when the host element has
            // been inserted so that we know exactly where to place it in
            // the namespace list
            this.newHostElements.set(hostElement, ns);
            // given that this host element is apart of the animation code, it
            // may or may not be inserted by a parent node that is an of an
            // animation renderer type. If this happens then we can still have
            // access to this item when we query for :enter nodes. If the parent
            // is a renderer then the set data-structure will normalize the entry
            this.collectEnterElement(hostElement);
        }
        return this._namespaceLookup[namespaceId] = ns;
    }
    /**
     * @param {?} ns
     * @param {?} hostElement
     * @return {?}
     */
    _balanceNamespaceList(ns, hostElement) {
        const /** @type {?} */ limit = this._namespaceList.length - 1;
        if (limit >= 0) {
            let /** @type {?} */ found = false;
            for (let /** @type {?} */ i = limit; i >= 0; i--) {
                const /** @type {?} */ nextNamespace = this._namespaceList[i];
                if (this.driver.containsElement(nextNamespace.hostElement, hostElement)) {
                    this._namespaceList.splice(i + 1, 0, ns);
                    found = true;
                    break;
                }
            }
            if (!found) {
                this._namespaceList.splice(0, 0, ns);
            }
        }
        else {
            this._namespaceList.push(ns);
        }
        this.namespacesByHostElement.set(hostElement, ns);
        return ns;
    }
    /**
     * @param {?} namespaceId
     * @param {?} hostElement
     * @return {?}
     */
    register(namespaceId, hostElement) {
        let /** @type {?} */ ns = this._namespaceLookup[namespaceId];
        if (!ns) {
            ns = this.createNamespace(namespaceId, hostElement);
        }
        return ns;
    }
    /**
     * @param {?} namespaceId
     * @param {?} name
     * @param {?} trigger
     * @return {?}
     */
    registerTrigger(namespaceId, name, trigger) {
        let /** @type {?} */ ns = this._namespaceLookup[namespaceId];
        if (ns && ns.register(name, trigger)) {
            this.totalAnimations++;
        }
    }
    /**
     * @param {?} namespaceId
     * @param {?} context
     * @return {?}
     */
    destroy(namespaceId, context) {
        if (!namespaceId)
            return;
        const /** @type {?} */ ns = this._fetchNamespace(namespaceId);
        this.afterFlush(() => {
            this.namespacesByHostElement.delete(ns.hostElement);
            delete this._namespaceLookup[namespaceId];
            const /** @type {?} */ index = this._namespaceList.indexOf(ns);
            if (index >= 0) {
                this._namespaceList.splice(index, 1);
            }
        });
        this.afterFlushAnimationsDone(() => ns.destroy(context));
    }
    /**
     * @param {?} id
     * @return {?}
     */
    _fetchNamespace(id) { return this._namespaceLookup[id]; }
    /**
     * @param {?} element
     * @return {?}
     */
    fetchNamespacesByElement(element) {
        // normally there should only be one namespace per element, however
        // if @triggers are placed on both the component element and then
        // its host element (within the component code) then there will be
        // two namespaces returned. We use a set here to simply the dedupe
        // of namespaces incase there are multiple triggers both the elm and host
        const /** @type {?} */ namespaces = new Set();
        const /** @type {?} */ elementStates = this.statesByElement.get(element);
        if (elementStates) {
            const /** @type {?} */ keys = Object.keys(elementStates);
            for (let /** @type {?} */ i = 0; i < keys.length; i++) {
                const /** @type {?} */ nsId = elementStates[keys[i]].namespaceId;
                if (nsId) {
                    const /** @type {?} */ ns = this._fetchNamespace(nsId);
                    if (ns) {
                        namespaces.add(ns);
                    }
                }
            }
        }
        return namespaces;
    }
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    trigger(namespaceId, element, name, value) {
        if (isElementNode(element)) {
            const /** @type {?} */ ns = this._fetchNamespace(namespaceId);
            if (ns) {
                ns.trigger(element, name, value);
                return true;
            }
        }
        return false;
    }
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?} parent
     * @param {?} insertBefore
     * @return {?}
     */
    insertNode(namespaceId, element, parent, insertBefore) {
        if (!isElementNode(element))
            return;
        // special case for when an element is removed and reinserted (move operation)
        // when this occurs we do not want to use the element for deletion later
        const /** @type {?} */ details = /** @type {?} */ (element[REMOVAL_FLAG]);
        if (details && details.setForRemoval) {
            details.setForRemoval = false;
            details.setForMove = true;
            const /** @type {?} */ index = this.collectedLeaveElements.indexOf(element);
            if (index >= 0) {
                this.collectedLeaveElements.splice(index, 1);
            }
        }
        // in the event that the namespaceId is blank then the caller
        // code does not contain any animation code in it, but it is
        // just being called so that the node is marked as being inserted
        if (namespaceId) {
            const /** @type {?} */ ns = this._fetchNamespace(namespaceId);
            // This if-statement is a workaround for router issue #21947.
            // The router sometimes hits a race condition where while a route
            // is being instantiated a new navigation arrives, triggering leave
            // animation of DOM that has not been fully initialized, until this
            // is resolved, we need to handle the scenario when DOM is not in a
            // consistent state during the animation.
            if (ns) {
                ns.insertNode(element, parent);
            }
        }
        // only *directives and host elements are inserted before
        if (insertBefore) {
            this.collectEnterElement(element);
        }
    }
    /**
     * @param {?} element
     * @return {?}
     */
    collectEnterElement(element) { this.collectedEnterElements.push(element); }
    /**
     * @param {?} element
     * @param {?} value
     * @return {?}
     */
    markElementAsDisabled(element, value) {
        if (value) {
            if (!this.disabledNodes.has(element)) {
                this.disabledNodes.add(element);
                addClass(element, DISABLED_CLASSNAME);
            }
        }
        else if (this.disabledNodes.has(element)) {
            this.disabledNodes.delete(element);
            removeClass(element, DISABLED_CLASSNAME);
        }
    }
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    removeNode(namespaceId, element, context) {
        if (!isElementNode(element)) {
            this._onRemovalComplete(element, context);
            return;
        }
        const /** @type {?} */ ns = namespaceId ? this._fetchNamespace(namespaceId) : null;
        if (ns) {
            ns.removeNode(element, context);
        }
        else {
            this.markElementAsRemoved(namespaceId, element, false, context);
        }
    }
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?=} hasAnimation
     * @param {?=} context
     * @return {?}
     */
    markElementAsRemoved(namespaceId, element, hasAnimation, context) {
        this.collectedLeaveElements.push(element);
        element[REMOVAL_FLAG] = {
            namespaceId,
            setForRemoval: context, hasAnimation,
            removedBeforeQueried: false
        };
    }
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?} name
     * @param {?} phase
     * @param {?} callback
     * @return {?}
     */
    listen(namespaceId, element, name, phase, callback) {
        if (isElementNode(element)) {
            return this._fetchNamespace(namespaceId).listen(element, name, phase, callback);
        }
        return () => { };
    }
    /**
     * @param {?} entry
     * @param {?} subTimelines
     * @param {?} enterClassName
     * @param {?} leaveClassName
     * @param {?=} skipBuildAst
     * @return {?}
     */
    _buildInstruction(entry, subTimelines, enterClassName, leaveClassName, skipBuildAst) {
        return entry.transition.build(this.driver, entry.element, entry.fromState.value, entry.toState.value, enterClassName, leaveClassName, entry.fromState.options, entry.toState.options, subTimelines, skipBuildAst);
    }
    /**
     * @param {?} containerElement
     * @return {?}
     */
    destroyInnerAnimations(containerElement) {
        let /** @type {?} */ elements = this.driver.query(containerElement, NG_TRIGGER_SELECTOR, true);
        elements.forEach(element => this.destroyActiveAnimationsForElement(element));
        if (this.playersByQueriedElement.size == 0)
            return;
        elements = this.driver.query(containerElement, NG_ANIMATING_SELECTOR, true);
        elements.forEach(element => this.finishActiveQueriedAnimationOnElement(element));
    }
    /**
     * @param {?} element
     * @return {?}
     */
    destroyActiveAnimationsForElement(element) {
        const /** @type {?} */ players = this.playersByElement.get(element);
        if (players) {
            players.forEach(player => {
                // special case for when an element is set for destruction, but hasn't started.
                // in this situation we want to delay the destruction until the flush occurs
                // so that any event listeners attached to the player are triggered.
                if (player.queued) {
                    player.markedForDestroy = true;
                }
                else {
                    player.destroy();
                }
            });
        }
    }
    /**
     * @param {?} element
     * @return {?}
     */
    finishActiveQueriedAnimationOnElement(element) {
        const /** @type {?} */ players = this.playersByQueriedElement.get(element);
        if (players) {
            players.forEach(player => player.finish());
        }
    }
    /**
     * @return {?}
     */
    whenRenderingDone() {
        return new Promise(resolve => {
            if (this.players.length) {
                return optimizeGroupPlayer(this.players).onDone(() => resolve());
            }
            else {
                resolve();
            }
        });
    }
    /**
     * @param {?} element
     * @return {?}
     */
    processLeaveNode(element) {
        const /** @type {?} */ details = /** @type {?} */ (element[REMOVAL_FLAG]);
        if (details && details.setForRemoval) {
            // this will prevent it from removing it twice
            element[REMOVAL_FLAG] = NULL_REMOVAL_STATE;
            if (details.namespaceId) {
                this.destroyInnerAnimations(element);
                const /** @type {?} */ ns = this._fetchNamespace(details.namespaceId);
                if (ns) {
                    ns.clearElementCache(element);
                }
            }
            this._onRemovalComplete(element, details.setForRemoval);
        }
        if (this.driver.matchesElement(element, DISABLED_SELECTOR)) {
            this.markElementAsDisabled(element, false);
        }
        this.driver.query(element, DISABLED_SELECTOR, true).forEach(node => {
            this.markElementAsDisabled(element, false);
        });
    }
    /**
     * @param {?=} microtaskId
     * @return {?}
     */
    flush(microtaskId = -1) {
        let /** @type {?} */ players = [];
        if (this.newHostElements.size) {
            this.newHostElements.forEach((ns, element) => this._balanceNamespaceList(ns, element));
            this.newHostElements.clear();
        }
        if (this.totalAnimations && this.collectedEnterElements.length) {
            for (let /** @type {?} */ i = 0; i < this.collectedEnterElements.length; i++) {
                const /** @type {?} */ elm = this.collectedEnterElements[i];
                addClass(elm, STAR_CLASSNAME);
            }
        }
        if (this._namespaceList.length &&
            (this.totalQueuedPlayers || this.collectedLeaveElements.length)) {
            const /** @type {?} */ cleanupFns = [];
            try {
                players = this._flushAnimations(cleanupFns, microtaskId);
            }
            finally {
                for (let /** @type {?} */ i = 0; i < cleanupFns.length; i++) {
                    cleanupFns[i]();
                }
            }
        }
        else {
            for (let /** @type {?} */ i = 0; i < this.collectedLeaveElements.length; i++) {
                const /** @type {?} */ element = this.collectedLeaveElements[i];
                this.processLeaveNode(element);
            }
        }
        this.totalQueuedPlayers = 0;
        this.collectedEnterElements.length = 0;
        this.collectedLeaveElements.length = 0;
        this._flushFns.forEach(fn => fn());
        this._flushFns = [];
        if (this._whenQuietFns.length) {
            // we move these over to a variable so that
            // if any new callbacks are registered in another
            // flush they do not populate the existing set
            const /** @type {?} */ quietFns = this._whenQuietFns;
            this._whenQuietFns = [];
            if (players.length) {
                optimizeGroupPlayer(players).onDone(() => { quietFns.forEach(fn => fn()); });
            }
            else {
                quietFns.forEach(fn => fn());
            }
        }
    }
    /**
     * @param {?} errors
     * @return {?}
     */
    reportError(errors) {
        throw new Error(`Unable to process animations due to the following failed trigger transitions\n ${errors.join('\n')}`);
    }
    /**
     * @param {?} cleanupFns
     * @param {?} microtaskId
     * @return {?}
     */
    _flushAnimations(cleanupFns, microtaskId) {
        const /** @type {?} */ subTimelines = new ElementInstructionMap();
        const /** @type {?} */ skippedPlayers = [];
        const /** @type {?} */ skippedPlayersMap = new Map();
        const /** @type {?} */ queuedInstructions = [];
        const /** @type {?} */ queriedElements = new Map();
        const /** @type {?} */ allPreStyleElements = new Map();
        const /** @type {?} */ allPostStyleElements = new Map();
        const /** @type {?} */ disabledElementsSet = new Set();
        this.disabledNodes.forEach(node => {
            disabledElementsSet.add(node);
            const /** @type {?} */ nodesThatAreDisabled = this.driver.query(node, QUEUED_SELECTOR, true);
            for (let /** @type {?} */ i = 0; i < nodesThatAreDisabled.length; i++) {
                disabledElementsSet.add(nodesThatAreDisabled[i]);
            }
        });
        const /** @type {?} */ bodyNode = this.bodyNode;
        const /** @type {?} */ allTriggerElements = Array.from(this.statesByElement.keys());
        const /** @type {?} */ enterNodeMap = buildRootMap(allTriggerElements, this.collectedEnterElements);
        // this must occur before the instructions are built below such that
        // the :enter queries match the elements (since the timeline queries
        // are fired during instruction building).
        const /** @type {?} */ enterNodeMapIds = new Map();
        let /** @type {?} */ i = 0;
        enterNodeMap.forEach((nodes, root) => {
            const /** @type {?} */ className = ENTER_CLASSNAME + i++;
            enterNodeMapIds.set(root, className);
            nodes.forEach(node => addClass(node, className));
        });
        const /** @type {?} */ allLeaveNodes = [];
        const /** @type {?} */ mergedLeaveNodes = new Set();
        const /** @type {?} */ leaveNodesWithoutAnimations = new Set();
        for (let /** @type {?} */ i = 0; i < this.collectedLeaveElements.length; i++) {
            const /** @type {?} */ element = this.collectedLeaveElements[i];
            const /** @type {?} */ details = /** @type {?} */ (element[REMOVAL_FLAG]);
            if (details && details.setForRemoval) {
                allLeaveNodes.push(element);
                mergedLeaveNodes.add(element);
                if (details.hasAnimation) {
                    this.driver.query(element, STAR_SELECTOR, true).forEach(elm => mergedLeaveNodes.add(elm));
                }
                else {
                    leaveNodesWithoutAnimations.add(element);
                }
            }
        }
        const /** @type {?} */ leaveNodeMapIds = new Map();
        const /** @type {?} */ leaveNodeMap = buildRootMap(allTriggerElements, Array.from(mergedLeaveNodes));
        leaveNodeMap.forEach((nodes, root) => {
            const /** @type {?} */ className = LEAVE_CLASSNAME + i++;
            leaveNodeMapIds.set(root, className);
            nodes.forEach(node => addClass(node, className));
        });
        cleanupFns.push(() => {
            enterNodeMap.forEach((nodes, root) => {
                const /** @type {?} */ className = /** @type {?} */ ((enterNodeMapIds.get(root)));
                nodes.forEach(node => removeClass(node, className));
            });
            leaveNodeMap.forEach((nodes, root) => {
                const /** @type {?} */ className = /** @type {?} */ ((leaveNodeMapIds.get(root)));
                nodes.forEach(node => removeClass(node, className));
            });
            allLeaveNodes.forEach(element => { this.processLeaveNode(element); });
        });
        const /** @type {?} */ allPlayers = [];
        const /** @type {?} */ erroneousTransitions = [];
        for (let /** @type {?} */ i = this._namespaceList.length - 1; i >= 0; i--) {
            const /** @type {?} */ ns = this._namespaceList[i];
            ns.drainQueuedTransitions(microtaskId).forEach(entry => {
                const /** @type {?} */ player = entry.player;
                const /** @type {?} */ element = entry.element;
                allPlayers.push(player);
                if (this.collectedEnterElements.length) {
                    const /** @type {?} */ details = /** @type {?} */ (element[REMOVAL_FLAG]);
                    // move animations are currently not supported...
                    if (details && details.setForMove) {
                        player.destroy();
                        return;
                    }
                }
                const /** @type {?} */ nodeIsOrphaned = !bodyNode || !this.driver.containsElement(bodyNode, element);
                const /** @type {?} */ leaveClassName = /** @type {?} */ ((leaveNodeMapIds.get(element)));
                const /** @type {?} */ enterClassName = /** @type {?} */ ((enterNodeMapIds.get(element)));
                const /** @type {?} */ instruction = /** @type {?} */ ((this._buildInstruction(entry, subTimelines, enterClassName, leaveClassName, nodeIsOrphaned)));
                if (instruction.errors && instruction.errors.length) {
                    erroneousTransitions.push(instruction);
                    return;
                }
                // even though the element may not be apart of the DOM, it may
                // still be added at a later point (due to the mechanics of content
                // projection and/or dynamic component insertion) therefore it's
                // important we still style the element.
                if (nodeIsOrphaned) {
                    player.onStart(() => eraseStyles(element, instruction.fromStyles));
                    player.onDestroy(() => setStyles(element, instruction.toStyles));
                    skippedPlayers.push(player);
                    return;
                }
                // if a unmatched transition is queued to go then it SHOULD NOT render
                // an animation and cancel the previously running animations.
                if (entry.isFallbackTransition) {
                    player.onStart(() => eraseStyles(element, instruction.fromStyles));
                    player.onDestroy(() => setStyles(element, instruction.toStyles));
                    skippedPlayers.push(player);
                    return;
                }
                // this means that if a parent animation uses this animation as a sub trigger
                // then it will instruct the timeline builder to not add a player delay, but
                // instead stretch the first keyframe gap up until the animation starts. The
                // reason this is important is to prevent extra initialization styles from being
                // required by the user in the animation.
                instruction.timelines.forEach(tl => tl.stretchStartingKeyframe = true);
                subTimelines.append(element, instruction.timelines);
                const /** @type {?} */ tuple = { instruction, player, element };
                queuedInstructions.push(tuple);
                instruction.queriedElements.forEach(element => getOrSetAsInMap(queriedElements, element, []).push(player));
                instruction.preStyleProps.forEach((stringMap, element) => {
                    const /** @type {?} */ props = Object.keys(stringMap);
                    if (props.length) {
                        let /** @type {?} */ setVal = /** @type {?} */ ((allPreStyleElements.get(element)));
                        if (!setVal) {
                            allPreStyleElements.set(element, setVal = new Set());
                        }
                        props.forEach(prop => setVal.add(prop));
                    }
                });
                instruction.postStyleProps.forEach((stringMap, element) => {
                    const /** @type {?} */ props = Object.keys(stringMap);
                    let /** @type {?} */ setVal = /** @type {?} */ ((allPostStyleElements.get(element)));
                    if (!setVal) {
                        allPostStyleElements.set(element, setVal = new Set());
                    }
                    props.forEach(prop => setVal.add(prop));
                });
            });
        }
        if (erroneousTransitions.length) {
            const /** @type {?} */ errors = [];
            erroneousTransitions.forEach(instruction => {
                errors.push(`@${instruction.triggerName} has failed due to:\n`); /** @type {?} */
                ((instruction.errors)).forEach(error => errors.push(`- ${error}\n`));
            });
            allPlayers.forEach(player => player.destroy());
            this.reportError(errors);
        }
        const /** @type {?} */ allPreviousPlayersMap = new Map();
        // this map works to tell which element in the DOM tree is contained by
        // which animation. Further down below this map will get populated once
        // the players are built and in doing so it can efficiently figure out
        // if a sub player is skipped due to a parent player having priority.
        const /** @type {?} */ animationElementMap = new Map();
        queuedInstructions.forEach(entry => {
            const /** @type {?} */ element = entry.element;
            if (subTimelines.has(element)) {
                animationElementMap.set(element, element);
                this._beforeAnimationBuild(entry.player.namespaceId, entry.instruction, allPreviousPlayersMap);
            }
        });
        skippedPlayers.forEach(player => {
            const /** @type {?} */ element = player.element;
            const /** @type {?} */ previousPlayers = this._getPreviousPlayers(element, false, player.namespaceId, player.triggerName, null);
            previousPlayers.forEach(prevPlayer => {
                getOrSetAsInMap(allPreviousPlayersMap, element, []).push(prevPlayer);
                prevPlayer.destroy();
            });
        });
        // this is a special case for nodes that will be removed (either by)
        // having their own leave animations or by being queried in a container
        // that will be removed once a parent animation is complete. The idea
        // here is that * styles must be identical to ! styles because of
        // backwards compatibility (* is also filled in by default in many places).
        // Otherwise * styles will return an empty value or auto since the element
        // that is being getComputedStyle'd will not be visible (since * = destination)
        const /** @type {?} */ replaceNodes = allLeaveNodes.filter(node => {
            return replacePostStylesAsPre(node, allPreStyleElements, allPostStyleElements);
        });
        // POST STAGE: fill the * styles
        const /** @type {?} */ postStylesMap = new Map();
        const /** @type {?} */ allLeaveQueriedNodes = cloakAndComputeStyles(postStylesMap, this.driver, leaveNodesWithoutAnimations, allPostStyleElements, AUTO_STYLE);
        allLeaveQueriedNodes.forEach(node => {
            if (replacePostStylesAsPre(node, allPreStyleElements, allPostStyleElements)) {
                replaceNodes.push(node);
            }
        });
        // PRE STAGE: fill the ! styles
        const /** @type {?} */ preStylesMap = new Map();
        enterNodeMap.forEach((nodes, root) => {
            cloakAndComputeStyles(preStylesMap, this.driver, new Set(nodes), allPreStyleElements, PRE_STYLE);
        });
        replaceNodes.forEach(node => {
            const /** @type {?} */ post = postStylesMap.get(node);
            const /** @type {?} */ pre = preStylesMap.get(node);
            postStylesMap.set(node, /** @type {?} */ (Object.assign({}, post, pre)));
        });
        const /** @type {?} */ rootPlayers = [];
        const /** @type {?} */ subPlayers = [];
        const /** @type {?} */ NO_PARENT_ANIMATION_ELEMENT_DETECTED = {};
        queuedInstructions.forEach(entry => {
            const { element, player, instruction } = entry;
            // this means that it was never consumed by a parent animation which
            // means that it is independent and therefore should be set for animation
            if (subTimelines.has(element)) {
                if (disabledElementsSet.has(element)) {
                    player.onDestroy(() => setStyles(element, instruction.toStyles));
                    player.disabled = true;
                    player.overrideTotalTime(instruction.totalTime);
                    skippedPlayers.push(player);
                    return;
                }
                // this will flow up the DOM and query the map to figure out
                // if a parent animation has priority over it. In the situation
                // that a parent is detected then it will cancel the loop. If
                // nothing is detected, or it takes a few hops to find a parent,
                // then it will fill in the missing nodes and signal them as having
                // a detected parent (or a NO_PARENT value via a special constant).
                let /** @type {?} */ parentWithAnimation = NO_PARENT_ANIMATION_ELEMENT_DETECTED;
                if (animationElementMap.size > 1) {
                    let /** @type {?} */ elm = element;
                    const /** @type {?} */ parentsToAdd = [];
                    while (elm = elm.parentNode) {
                        const /** @type {?} */ detectedParent = animationElementMap.get(elm);
                        if (detectedParent) {
                            parentWithAnimation = detectedParent;
                            break;
                        }
                        parentsToAdd.push(elm);
                    }
                    parentsToAdd.forEach(parent => animationElementMap.set(parent, parentWithAnimation));
                }
                const /** @type {?} */ innerPlayer = this._buildAnimation(player.namespaceId, instruction, allPreviousPlayersMap, skippedPlayersMap, preStylesMap, postStylesMap);
                player.setRealPlayer(innerPlayer);
                if (parentWithAnimation === NO_PARENT_ANIMATION_ELEMENT_DETECTED) {
                    rootPlayers.push(player);
                }
                else {
                    const /** @type {?} */ parentPlayers = this.playersByElement.get(parentWithAnimation);
                    if (parentPlayers && parentPlayers.length) {
                        player.parentPlayer = optimizeGroupPlayer(parentPlayers);
                    }
                    skippedPlayers.push(player);
                }
            }
            else {
                eraseStyles(element, instruction.fromStyles);
                player.onDestroy(() => setStyles(element, instruction.toStyles));
                // there still might be a ancestor player animating this
                // element therefore we will still add it as a sub player
                // even if its animation may be disabled
                subPlayers.push(player);
                if (disabledElementsSet.has(element)) {
                    skippedPlayers.push(player);
                }
            }
        });
        // find all of the sub players' corresponding inner animation player
        subPlayers.forEach(player => {
            // even if any players are not found for a sub animation then it
            // will still complete itself after the next tick since it's Noop
            const /** @type {?} */ playersForElement = skippedPlayersMap.get(player.element);
            if (playersForElement && playersForElement.length) {
                const /** @type {?} */ innerPlayer = optimizeGroupPlayer(playersForElement);
                player.setRealPlayer(innerPlayer);
            }
        });
        // the reason why we don't actually play the animation is
        // because all that a skipped player is designed to do is to
        // fire the start/done transition callback events
        skippedPlayers.forEach(player => {
            if (player.parentPlayer) {
                player.syncPlayerEvents(player.parentPlayer);
            }
            else {
                player.destroy();
            }
        });
        // run through all of the queued removals and see if they
        // were picked up by a query. If not then perform the removal
        // operation right away unless a parent animation is ongoing.
        for (let /** @type {?} */ i = 0; i < allLeaveNodes.length; i++) {
            const /** @type {?} */ element = allLeaveNodes[i];
            const /** @type {?} */ details = /** @type {?} */ (element[REMOVAL_FLAG]);
            removeClass(element, LEAVE_CLASSNAME);
            // this means the element has a removal animation that is being
            // taken care of and therefore the inner elements will hang around
            // until that animation is over (or the parent queried animation)
            if (details && details.hasAnimation)
                continue;
            let /** @type {?} */ players = [];
            // if this element is queried or if it contains queried children
            // then we want for the element not to be removed from the page
            // until the queried animations have finished
            if (queriedElements.size) {
                let /** @type {?} */ queriedPlayerResults = queriedElements.get(element);
                if (queriedPlayerResults && queriedPlayerResults.length) {
                    players.push(...queriedPlayerResults);
                }
                let /** @type {?} */ queriedInnerElements = this.driver.query(element, NG_ANIMATING_SELECTOR, true);
                for (let /** @type {?} */ j = 0; j < queriedInnerElements.length; j++) {
                    let /** @type {?} */ queriedPlayers = queriedElements.get(queriedInnerElements[j]);
                    if (queriedPlayers && queriedPlayers.length) {
                        players.push(...queriedPlayers);
                    }
                }
            }
            const /** @type {?} */ activePlayers = players.filter(p => !p.destroyed);
            if (activePlayers.length) {
                removeNodesAfterAnimationDone(this, element, activePlayers);
            }
            else {
                this.processLeaveNode(element);
            }
        }
        // this is required so the cleanup method doesn't remove them
        allLeaveNodes.length = 0;
        rootPlayers.forEach(player => {
            this.players.push(player);
            player.onDone(() => {
                player.destroy();
                const /** @type {?} */ index = this.players.indexOf(player);
                this.players.splice(index, 1);
            });
            player.play();
        });
        return rootPlayers;
    }
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @return {?}
     */
    elementContainsData(namespaceId, element) {
        let /** @type {?} */ containsData = false;
        const /** @type {?} */ details = /** @type {?} */ (element[REMOVAL_FLAG]);
        if (details && details.setForRemoval)
            containsData = true;
        if (this.playersByElement.has(element))
            containsData = true;
        if (this.playersByQueriedElement.has(element))
            containsData = true;
        if (this.statesByElement.has(element))
            containsData = true;
        return this._fetchNamespace(namespaceId).elementContainsData(element) || containsData;
    }
    /**
     * @param {?} callback
     * @return {?}
     */
    afterFlush(callback) { this._flushFns.push(callback); }
    /**
     * @param {?} callback
     * @return {?}
     */
    afterFlushAnimationsDone(callback) { this._whenQuietFns.push(callback); }
    /**
     * @param {?} element
     * @param {?} isQueriedElement
     * @param {?=} namespaceId
     * @param {?=} triggerName
     * @param {?=} toStateValue
     * @return {?}
     */
    _getPreviousPlayers(element, isQueriedElement, namespaceId, triggerName, toStateValue) {
        let /** @type {?} */ players = [];
        if (isQueriedElement) {
            const /** @type {?} */ queriedElementPlayers = this.playersByQueriedElement.get(element);
            if (queriedElementPlayers) {
                players = queriedElementPlayers;
            }
        }
        else {
            const /** @type {?} */ elementPlayers = this.playersByElement.get(element);
            if (elementPlayers) {
                const /** @type {?} */ isRemovalAnimation = !toStateValue || toStateValue == VOID_VALUE;
                elementPlayers.forEach(player => {
                    if (player.queued)
                        return;
                    if (!isRemovalAnimation && player.triggerName != triggerName)
                        return;
                    players.push(player);
                });
            }
        }
        if (namespaceId || triggerName) {
            players = players.filter(player => {
                if (namespaceId && namespaceId != player.namespaceId)
                    return false;
                if (triggerName && triggerName != player.triggerName)
                    return false;
                return true;
            });
        }
        return players;
    }
    /**
     * @param {?} namespaceId
     * @param {?} instruction
     * @param {?} allPreviousPlayersMap
     * @return {?}
     */
    _beforeAnimationBuild(namespaceId, instruction, allPreviousPlayersMap) {
        const /** @type {?} */ triggerName = instruction.triggerName;
        const /** @type {?} */ rootElement = instruction.element;
        // when a removal animation occurs, ALL previous players are collected
        // and destroyed (even if they are outside of the current namespace)
        const /** @type {?} */ targetNameSpaceId = instruction.isRemovalTransition ? undefined : namespaceId;
        const /** @type {?} */ targetTriggerName = instruction.isRemovalTransition ? undefined : triggerName;
        for (const /** @type {?} */ timelineInstruction of instruction.timelines) {
            const /** @type {?} */ element = timelineInstruction.element;
            const /** @type {?} */ isQueriedElement = element !== rootElement;
            const /** @type {?} */ players = getOrSetAsInMap(allPreviousPlayersMap, element, []);
            const /** @type {?} */ previousPlayers = this._getPreviousPlayers(element, isQueriedElement, targetNameSpaceId, targetTriggerName, instruction.toState);
            previousPlayers.forEach(player => {
                const /** @type {?} */ realPlayer = /** @type {?} */ (player.getRealPlayer());
                if (realPlayer.beforeDestroy) {
                    realPlayer.beforeDestroy();
                }
                player.destroy();
                players.push(player);
            });
        }
        // this needs to be done so that the PRE/POST styles can be
        // computed properly without interfering with the previous animation
        eraseStyles(rootElement, instruction.fromStyles);
    }
    /**
     * @param {?} namespaceId
     * @param {?} instruction
     * @param {?} allPreviousPlayersMap
     * @param {?} skippedPlayersMap
     * @param {?} preStylesMap
     * @param {?} postStylesMap
     * @return {?}
     */
    _buildAnimation(namespaceId, instruction, allPreviousPlayersMap, skippedPlayersMap, preStylesMap, postStylesMap) {
        const /** @type {?} */ triggerName = instruction.triggerName;
        const /** @type {?} */ rootElement = instruction.element;
        // we first run this so that the previous animation player
        // data can be passed into the successive animation players
        const /** @type {?} */ allQueriedPlayers = [];
        const /** @type {?} */ allConsumedElements = new Set();
        const /** @type {?} */ allSubElements = new Set();
        const /** @type {?} */ allNewPlayers = instruction.timelines.map(timelineInstruction => {
            const /** @type {?} */ element = timelineInstruction.element;
            allConsumedElements.add(element);
            // FIXME (matsko): make sure to-be-removed animations are removed properly
            const /** @type {?} */ details = element[REMOVAL_FLAG];
            if (details && details.removedBeforeQueried)
                return new NoopAnimationPlayer(timelineInstruction.duration, timelineInstruction.delay);
            const /** @type {?} */ isQueriedElement = element !== rootElement;
            const /** @type {?} */ previousPlayers = flattenGroupPlayers((allPreviousPlayersMap.get(element) || EMPTY_PLAYER_ARRAY)
                .map(p => p.getRealPlayer()))
                .filter(p => {
                // the `element` is not apart of the AnimationPlayer definition, but
                // Mock/WebAnimations
                // use the element within their implementation. This will be added in Angular5 to
                // AnimationPlayer
                const /** @type {?} */ pp = /** @type {?} */ (p);
                return pp.element ? pp.element === element : false;
            });
            const /** @type {?} */ preStyles = preStylesMap.get(element);
            const /** @type {?} */ postStyles = postStylesMap.get(element);
            const /** @type {?} */ keyframes = normalizeKeyframes(this.driver, this._normalizer, element, timelineInstruction.keyframes, preStyles, postStyles);
            const /** @type {?} */ player = this._buildPlayer(timelineInstruction, keyframes, previousPlayers);
            // this means that this particular player belongs to a sub trigger. It is
            // important that we match this player up with the corresponding (@trigger.listener)
            if (timelineInstruction.subTimeline && skippedPlayersMap) {
                allSubElements.add(element);
            }
            if (isQueriedElement) {
                const /** @type {?} */ wrappedPlayer = new TransitionAnimationPlayer(namespaceId, triggerName, element);
                wrappedPlayer.setRealPlayer(player);
                allQueriedPlayers.push(wrappedPlayer);
            }
            return player;
        });
        allQueriedPlayers.forEach(player => {
            getOrSetAsInMap(this.playersByQueriedElement, player.element, []).push(player);
            player.onDone(() => deleteOrUnsetInMap(this.playersByQueriedElement, player.element, player));
        });
        allConsumedElements.forEach(element => addClass(element, NG_ANIMATING_CLASSNAME));
        const /** @type {?} */ player = optimizeGroupPlayer(allNewPlayers);
        player.onDestroy(() => {
            allConsumedElements.forEach(element => removeClass(element, NG_ANIMATING_CLASSNAME));
            setStyles(rootElement, instruction.toStyles);
        });
        // this basically makes all of the callbacks for sub element animations
        // be dependent on the upper players for when they finish
        allSubElements.forEach(element => { getOrSetAsInMap(skippedPlayersMap, element, []).push(player); });
        return player;
    }
    /**
     * @param {?} instruction
     * @param {?} keyframes
     * @param {?} previousPlayers
     * @return {?}
     */
    _buildPlayer(instruction, keyframes, previousPlayers) {
        if (keyframes.length > 0) {
            return this.driver.animate(instruction.element, keyframes, instruction.duration, instruction.delay, instruction.easing, previousPlayers);
        }
        // special case for when an empty transition|definition is provided
        // ... there is no point in rendering an empty animation
        return new NoopAnimationPlayer(instruction.duration, instruction.delay);
    }
}
function TransitionAnimationEngine_tsickle_Closure_declarations() {
    /** @type {?} */
    TransitionAnimationEngine.prototype.players;
    /** @type {?} */
    TransitionAnimationEngine.prototype.newHostElements;
    /** @type {?} */
    TransitionAnimationEngine.prototype.playersByElement;
    /** @type {?} */
    TransitionAnimationEngine.prototype.playersByQueriedElement;
    /** @type {?} */
    TransitionAnimationEngine.prototype.statesByElement;
    /** @type {?} */
    TransitionAnimationEngine.prototype.disabledNodes;
    /** @type {?} */
    TransitionAnimationEngine.prototype.totalAnimations;
    /** @type {?} */
    TransitionAnimationEngine.prototype.totalQueuedPlayers;
    /** @type {?} */
    TransitionAnimationEngine.prototype._namespaceLookup;
    /** @type {?} */
    TransitionAnimationEngine.prototype._namespaceList;
    /** @type {?} */
    TransitionAnimationEngine.prototype._flushFns;
    /** @type {?} */
    TransitionAnimationEngine.prototype._whenQuietFns;
    /** @type {?} */
    TransitionAnimationEngine.prototype.namespacesByHostElement;
    /** @type {?} */
    TransitionAnimationEngine.prototype.collectedEnterElements;
    /** @type {?} */
    TransitionAnimationEngine.prototype.collectedLeaveElements;
    /** @type {?} */
    TransitionAnimationEngine.prototype.onRemovalComplete;
    /** @type {?} */
    TransitionAnimationEngine.prototype.bodyNode;
    /** @type {?} */
    TransitionAnimationEngine.prototype.driver;
    /** @type {?} */
    TransitionAnimationEngine.prototype._normalizer;
}
export class TransitionAnimationPlayer {
    /**
     * @param {?} namespaceId
     * @param {?} triggerName
     * @param {?} element
     */
    constructor(namespaceId, triggerName, element) {
        this.namespaceId = namespaceId;
        this.triggerName = triggerName;
        this.element = element;
        this._player = new NoopAnimationPlayer();
        this._containsRealPlayer = false;
        this._queuedCallbacks = {};
        this.destroyed = false;
        this.markedForDestroy = false;
        this.disabled = false;
        this.queued = true;
        this.totalTime = 0;
    }
    /**
     * @param {?} player
     * @return {?}
     */
    setRealPlayer(player) {
        if (this._containsRealPlayer)
            return;
        this._player = player;
        Object.keys(this._queuedCallbacks).forEach(phase => {
            this._queuedCallbacks[phase].forEach(callback => listenOnPlayer(player, phase, undefined, callback));
        });
        this._queuedCallbacks = {};
        this._containsRealPlayer = true;
        this.overrideTotalTime(player.totalTime);
        (/** @type {?} */ (this)).queued = false;
    }
    /**
     * @return {?}
     */
    getRealPlayer() { return this._player; }
    /**
     * @param {?} totalTime
     * @return {?}
     */
    overrideTotalTime(totalTime) { (/** @type {?} */ (this)).totalTime = totalTime; }
    /**
     * @param {?} player
     * @return {?}
     */
    syncPlayerEvents(player) {
        const /** @type {?} */ p = /** @type {?} */ (this._player);
        if (p.triggerCallback) {
            player.onStart(() => /** @type {?} */ ((p.triggerCallback))('start'));
        }
        player.onDone(() => this.finish());
        player.onDestroy(() => this.destroy());
    }
    /**
     * @param {?} name
     * @param {?} callback
     * @return {?}
     */
    _queueEvent(name, callback) {
        getOrSetAsInMap(this._queuedCallbacks, name, []).push(callback);
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    onDone(fn) {
        if (this.queued) {
            this._queueEvent('done', fn);
        }
        this._player.onDone(fn);
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    onStart(fn) {
        if (this.queued) {
            this._queueEvent('start', fn);
        }
        this._player.onStart(fn);
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    onDestroy(fn) {
        if (this.queued) {
            this._queueEvent('destroy', fn);
        }
        this._player.onDestroy(fn);
    }
    /**
     * @return {?}
     */
    init() { this._player.init(); }
    /**
     * @return {?}
     */
    hasStarted() { return this.queued ? false : this._player.hasStarted(); }
    /**
     * @return {?}
     */
    play() { !this.queued && this._player.play(); }
    /**
     * @return {?}
     */
    pause() { !this.queued && this._player.pause(); }
    /**
     * @return {?}
     */
    restart() { !this.queued && this._player.restart(); }
    /**
     * @return {?}
     */
    finish() { this._player.finish(); }
    /**
     * @return {?}
     */
    destroy() {
        (/** @type {?} */ (this)).destroyed = true;
        this._player.destroy();
    }
    /**
     * @return {?}
     */
    reset() { !this.queued && this._player.reset(); }
    /**
     * @param {?} p
     * @return {?}
     */
    setPosition(p) {
        if (!this.queued) {
            this._player.setPosition(p);
        }
    }
    /**
     * @return {?}
     */
    getPosition() { return this.queued ? 0 : this._player.getPosition(); }
    /**
     * @param {?} phaseName
     * @return {?}
     */
    triggerCallback(phaseName) {
        const /** @type {?} */ p = /** @type {?} */ (this._player);
        if (p.triggerCallback) {
            p.triggerCallback(phaseName);
        }
    }
}
function TransitionAnimationPlayer_tsickle_Closure_declarations() {
    /** @type {?} */
    TransitionAnimationPlayer.prototype._player;
    /** @type {?} */
    TransitionAnimationPlayer.prototype._containsRealPlayer;
    /** @type {?} */
    TransitionAnimationPlayer.prototype._queuedCallbacks;
    /** @type {?} */
    TransitionAnimationPlayer.prototype.destroyed;
    /** @type {?} */
    TransitionAnimationPlayer.prototype.parentPlayer;
    /** @type {?} */
    TransitionAnimationPlayer.prototype.markedForDestroy;
    /** @type {?} */
    TransitionAnimationPlayer.prototype.disabled;
    /** @type {?} */
    TransitionAnimationPlayer.prototype.queued;
    /** @type {?} */
    TransitionAnimationPlayer.prototype.totalTime;
    /** @type {?} */
    TransitionAnimationPlayer.prototype.namespaceId;
    /** @type {?} */
    TransitionAnimationPlayer.prototype.triggerName;
    /** @type {?} */
    TransitionAnimationPlayer.prototype.element;
}
/**
 * @param {?} map
 * @param {?} key
 * @param {?} value
 * @return {?}
 */
function deleteOrUnsetInMap(map, key, value) {
    let /** @type {?} */ currentValues;
    if (map instanceof Map) {
        currentValues = map.get(key);
        if (currentValues) {
            if (currentValues.length) {
                const /** @type {?} */ index = currentValues.indexOf(value);
                currentValues.splice(index, 1);
            }
            if (currentValues.length == 0) {
                map.delete(key);
            }
        }
    }
    else {
        currentValues = map[key];
        if (currentValues) {
            if (currentValues.length) {
                const /** @type {?} */ index = currentValues.indexOf(value);
                currentValues.splice(index, 1);
            }
            if (currentValues.length == 0) {
                delete map[key];
            }
        }
    }
    return currentValues;
}
/**
 * @param {?} value
 * @return {?}
 */
function normalizeTriggerValue(value) {
    // we use `!= null` here because it's the most simple
    // way to test against a "falsy" value without mixing
    // in empty strings or a zero value. DO NOT OPTIMIZE.
    return value != null ? value : null;
}
/**
 * @param {?} node
 * @return {?}
 */
function isElementNode(node) {
    return node && node['nodeType'] === 1;
}
/**
 * @param {?} eventName
 * @return {?}
 */
function isTriggerEventValid(eventName) {
    return eventName == 'start' || eventName == 'done';
}
/**
 * @param {?} element
 * @param {?=} value
 * @return {?}
 */
function cloakElement(element, value) {
    const /** @type {?} */ oldValue = element.style.display;
    element.style.display = value != null ? value : 'none';
    return oldValue;
}
/**
 * @param {?} valuesMap
 * @param {?} driver
 * @param {?} elements
 * @param {?} elementPropsMap
 * @param {?} defaultStyle
 * @return {?}
 */
function cloakAndComputeStyles(valuesMap, driver, elements, elementPropsMap, defaultStyle) {
    const /** @type {?} */ cloakVals = [];
    elements.forEach(element => cloakVals.push(cloakElement(element)));
    const /** @type {?} */ failedElements = [];
    elementPropsMap.forEach((props, element) => {
        const /** @type {?} */ styles = {};
        props.forEach(prop => {
            const /** @type {?} */ value = styles[prop] = driver.computeStyle(element, prop, defaultStyle);
            // there is no easy way to detect this because a sub element could be removed
            // by a parent animation element being detached.
            if (!value || value.length == 0) {
                element[REMOVAL_FLAG] = NULL_REMOVED_QUERIED_STATE;
                failedElements.push(element);
            }
        });
        valuesMap.set(element, styles);
    });
    // we use a index variable here since Set.forEach(a, i) does not return
    // an index value for the closure (but instead just the value)
    let /** @type {?} */ i = 0;
    elements.forEach(element => cloakElement(element, cloakVals[i++]));
    return failedElements;
}
/**
 * @param {?} roots
 * @param {?} nodes
 * @return {?}
 */
function buildRootMap(roots, nodes) {
    const /** @type {?} */ rootMap = new Map();
    roots.forEach(root => rootMap.set(root, []));
    if (nodes.length == 0)
        return rootMap;
    const /** @type {?} */ NULL_NODE = 1;
    const /** @type {?} */ nodeSet = new Set(nodes);
    const /** @type {?} */ localRootMap = new Map();
    /**
     * @param {?} node
     * @return {?}
     */
    function getRoot(node) {
        if (!node)
            return NULL_NODE;
        let /** @type {?} */ root = localRootMap.get(node);
        if (root)
            return root;
        const /** @type {?} */ parent = node.parentNode;
        if (rootMap.has(parent)) { // ngIf inside @trigger
            // ngIf inside @trigger
            root = parent;
        }
        else if (nodeSet.has(parent)) { // ngIf inside ngIf
            // ngIf inside ngIf
            root = NULL_NODE;
        }
        else { // recurse upwards
            // recurse upwards
            root = getRoot(parent);
        }
        localRootMap.set(node, root);
        return root;
    }
    nodes.forEach(node => {
        const /** @type {?} */ root = getRoot(node);
        if (root !== NULL_NODE) {
            /** @type {?} */ ((rootMap.get(root))).push(node);
        }
    });
    return rootMap;
}
const /** @type {?} */ CLASSES_CACHE_KEY = '$$classes';
/**
 * @param {?} element
 * @param {?} className
 * @return {?}
 */
function containsClass(element, className) {
    if (element.classList) {
        return element.classList.contains(className);
    }
    else {
        const /** @type {?} */ classes = element[CLASSES_CACHE_KEY];
        return classes && classes[className];
    }
}
/**
 * @param {?} element
 * @param {?} className
 * @return {?}
 */
function addClass(element, className) {
    if (element.classList) {
        element.classList.add(className);
    }
    else {
        let /** @type {?} */ classes = element[CLASSES_CACHE_KEY];
        if (!classes) {
            classes = element[CLASSES_CACHE_KEY] = {};
        }
        classes[className] = true;
    }
}
/**
 * @param {?} element
 * @param {?} className
 * @return {?}
 */
function removeClass(element, className) {
    if (element.classList) {
        element.classList.remove(className);
    }
    else {
        let /** @type {?} */ classes = element[CLASSES_CACHE_KEY];
        if (classes) {
            delete classes[className];
        }
    }
}
/**
 * @param {?} engine
 * @param {?} element
 * @param {?} players
 * @return {?}
 */
function removeNodesAfterAnimationDone(engine, element, players) {
    optimizeGroupPlayer(players).onDone(() => engine.processLeaveNode(element));
}
/**
 * @param {?} players
 * @return {?}
 */
function flattenGroupPlayers(players) {
    const /** @type {?} */ finalPlayers = [];
    _flattenGroupPlayersRecur(players, finalPlayers);
    return finalPlayers;
}
/**
 * @param {?} players
 * @param {?} finalPlayers
 * @return {?}
 */
function _flattenGroupPlayersRecur(players, finalPlayers) {
    for (let /** @type {?} */ i = 0; i < players.length; i++) {
        const /** @type {?} */ player = players[i];
        if (player instanceof AnimationGroupPlayer) {
            _flattenGroupPlayersRecur(player.players, finalPlayers);
        }
        else {
            finalPlayers.push(/** @type {?} */ (player));
        }
    }
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function objEquals(a, b) {
    const /** @type {?} */ k1 = Object.keys(a);
    const /** @type {?} */ k2 = Object.keys(b);
    if (k1.length != k2.length)
        return false;
    for (let /** @type {?} */ i = 0; i < k1.length; i++) {
        const /** @type {?} */ prop = k1[i];
        if (!b.hasOwnProperty(prop) || a[prop] !== b[prop])
            return false;
    }
    return true;
}
/**
 * @param {?} element
 * @param {?} allPreStyleElements
 * @param {?} allPostStyleElements
 * @return {?}
 */
function replacePostStylesAsPre(element, allPreStyleElements, allPostStyleElements) {
    const /** @type {?} */ postEntry = allPostStyleElements.get(element);
    if (!postEntry)
        return false;
    let /** @type {?} */ preEntry = allPreStyleElements.get(element);
    if (preEntry) {
        postEntry.forEach(data => /** @type {?} */ ((preEntry)).add(data));
    }
    else {
        allPreStyleElements.set(element, postEntry);
    }
    allPostStyleElements.delete(element);
    return true;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNpdGlvbl9hbmltYXRpb25fZW5naW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9icm93c2VyL3NyYy9yZW5kZXIvdHJhbnNpdGlvbl9hbmltYXRpb25fZW5naW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFPQSxPQUFPLEVBQUMsVUFBVSxFQUFxQyxtQkFBbUIsRUFBRSxxQkFBcUIsSUFBSSxvQkFBb0IsRUFBRSxVQUFVLElBQUksU0FBUyxFQUFhLE1BQU0scUJBQXFCLENBQUM7QUFNM0wsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sZ0NBQWdDLENBQUM7QUFFckUsT0FBTyxFQUFDLGVBQWUsRUFBRSxlQUFlLEVBQUUsc0JBQXNCLEVBQUUscUJBQXFCLEVBQUUsb0JBQW9CLEVBQUUsbUJBQW1CLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBbUIsU0FBUyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBR3JNLE9BQU8sRUFBQyxlQUFlLEVBQUUsY0FBYyxFQUFFLGtCQUFrQixFQUFFLGtCQUFrQixFQUFFLG1CQUFtQixFQUFDLE1BQU0sVUFBVSxDQUFDO0FBRXRILHVCQUFNLGdCQUFnQixHQUFHLG1CQUFtQixDQUFDO0FBQzdDLHVCQUFNLGVBQWUsR0FBRyxvQkFBb0IsQ0FBQztBQUM3Qyx1QkFBTSxrQkFBa0IsR0FBRyxxQkFBcUIsQ0FBQztBQUNqRCx1QkFBTSxpQkFBaUIsR0FBRyxzQkFBc0IsQ0FBQztBQUNqRCx1QkFBTSxjQUFjLEdBQUcsa0JBQWtCLENBQUM7QUFDMUMsdUJBQU0sYUFBYSxHQUFHLG1CQUFtQixDQUFDO0FBRTFDLHVCQUFNLGtCQUFrQixHQUFnQyxFQUFFLENBQUM7QUFDM0QsdUJBQU0sa0JBQWtCLEdBQTBCO0lBQ2hELFdBQVcsRUFBRSxFQUFFO0lBQ2YsYUFBYSxFQUFFLEtBQUs7SUFDcEIsVUFBVSxFQUFFLEtBQUs7SUFD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eEQsb0JBQTJDO0lBQzdDLHVCQUFNLFNBQVMsR0FBRyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDcEQsSUFBSSxDQUFDLFNBQVM7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUU3QixxQkFBSSxRQUFRLEdBQUcsbUJBQW1CLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2hELElBQUksUUFBUSxFQUFFO1FBQ1osU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxvQkFBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDakQ7U0FBTTtRQUNMLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7S0FDN0M7SUFFRCxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckMsT0FBTyxJQUFJLENBQUM7Q0FDYiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QVVUT19TVFlMRSwgQW5pbWF0aW9uT3B0aW9ucywgQW5pbWF0aW9uUGxheWVyLCBOb29wQW5pbWF0aW9uUGxheWVyLCDJtUFuaW1hdGlvbkdyb3VwUGxheWVyIGFzIEFuaW1hdGlvbkdyb3VwUGxheWVyLCDJtVBSRV9TVFlMRSBhcyBQUkVfU1RZTEUsIMm1U3R5bGVEYXRhfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuaW1wb3J0IHtBbmltYXRpb25UaW1lbGluZUluc3RydWN0aW9ufSBmcm9tICcuLi9kc2wvYW5pbWF0aW9uX3RpbWVsaW5lX2luc3RydWN0aW9uJztcbmltcG9ydCB7QW5pbWF0aW9uVHJhbnNpdGlvbkZhY3Rvcnl9IGZyb20gJy4uL2RzbC9hbmltYXRpb25fdHJhbnNpdGlvbl9mYWN0b3J5JztcbmltcG9ydCB7QW5pbWF0aW9uVHJhbnNpdGlvbkluc3RydWN0aW9ufSBmcm9tICcuLi9kc2wvYW5pbWF0aW9uX3RyYW5zaXRpb25faW5zdHJ1Y3Rpb24nO1xuaW1wb3J0IHtBbmltYXRpb25UcmlnZ2VyfSBmcm9tICcuLi9kc2wvYW5pbWF0aW9uX3RyaWdnZXInO1xuaW1wb3J0IHtFbGVtZW50SW5zdHJ1Y3Rpb25NYXB9IGZyb20gJy4uL2RzbC9lbGVtZW50X2luc3RydWN0aW9uX21hcCc7XG5pbXBvcnQge0FuaW1hdGlvblN0eWxlTm9ybWFsaXplcn0gZnJvbSAnLi4vZHNsL3N0eWxlX25vcm1hbGl6YXRpb24vYW5pbWF0aW9uX3N0eWxlX25vcm1hbGl6ZXInO1xuaW1wb3J0IHtFTlRFUl9DTEFTU05BTUUsIExFQVZFX0NMQVNTTkFNRSwgTkdfQU5JTUFUSU5HX0NMQVNTTkFNRSwgTkdfQU5JTUFUSU5HX1NFTEVDVE9SLCBOR19UUklHR0VSX0NMQVNTTkFNRSwgTkdfVFJJR0dFUl9TRUxFQ1RPUiwgY29weU9iaiwgZXJhc2VTdHlsZXMsIGl0ZXJhdG9yVG9BcnJheSwgc2V0U3R5bGVzfSBmcm9tICcuLi91dGlsJztcblxuaW1wb3J0IHtBbmltYXRpb25Ecml2ZXJ9IGZyb20gJy4vYW5pbWF0aW9uX2RyaXZlcic7XG5pbXBvcnQge2dldE9yU2V0QXNJbk1hcCwgbGlzdGVuT25QbGF5ZXIsIG1ha2VBbmltYXRpb25FdmVudCwgbm9ybWFsaXplS2V5ZnJhbWVzLCBvcHRpbWl6ZUdyb3VwUGxheWVyfSBmcm9tICcuL3NoYXJlZCc7XG5cbmNvbnN0IFFVRVVFRF9DTEFTU05BTUUgPSAnbmctYW5pbWF0ZS1xdWV1ZWQnO1xuY29uc3QgUVVFVUVEX1NFTEVDVE9SID0gJy5uZy1hbmltYXRlLXF1ZXVlZCc7XG5jb25zdCBESVNBQkxFRF9DTEFTU05BTUUgPSAnbmctYW5pbWF0ZS1kaXNhYmxlZCc7XG5jb25zdCBESVNBQkxFRF9TRUxFQ1RPUiA9ICcubmctYW5pbWF0ZS1kaXNhYmxlZCc7XG5jb25zdCBTVEFSX0NMQVNTTkFNRSA9ICduZy1zdGFyLWluc2VydGVkJztcbmNvbnN0IFNUQVJfU0VMRUNUT1IgPSAnLm5nLXN0YXItaW5zZXJ0ZWQnO1xuXG5jb25zdCBFTVBUWV9QTEFZRVJfQVJSQVk6IFRyYW5zaXRpb25BbmltYXRpb25QbGF5ZXJbXSA9IFtdO1xuY29uc3QgTlVMTF9SRU1PVkFMX1NUQVRFOiBFbGVtZW50QW5pbWF0aW9uU3RhdGUgPSB7XG4gIG5hbWVzcGFjZUlkOiAnJyxcbiAgc2V0Rm9yUmVtb3ZhbDogZmFsc2UsXG4gIHNldEZvck1vdmU6IGZhbHNlLFxuICBoYXNBbmltYXRpb246IGZhbHNlLFxuICByZW1vdmVkQmVmb3JlUXVlcmllZDogZmFsc2Vcbn07XG5jb25zdCBOVUxMX1JFTU9WRURfUVVFUklFRF9TVEFURTogRWxlbWVudEFuaW1hdGlvblN0YXRlID0ge1xuICBuYW1lc3BhY2VJZDogJycsXG4gIHNldEZvck1vdmU6IGZhbHNlLFxuICBzZXRGb3JSZW1vdmFsOiBmYWxzZSxcbiAgaGFzQW5pbWF0aW9uOiBmYWxzZSxcbiAgcmVtb3ZlZEJlZm9yZVF1ZXJpZWQ6IHRydWVcbn07XG5cbmludGVyZmFjZSBUcmlnZ2VyTGlzdGVuZXIge1xuICBuYW1lOiBzdHJpbmc7XG4gIHBoYXNlOiBzdHJpbmc7XG4gIGNhbGxiYWNrOiAoZXZlbnQ6IGFueSkgPT4gYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXVlSW5zdHJ1Y3Rpb24ge1xuICBlbGVtZW50OiBhbnk7XG4gIHRyaWdnZXJOYW1lOiBzdHJpbmc7XG4gIGZyb21TdGF0ZTogU3RhdGVWYWx1ZTtcbiAgdG9TdGF0ZTogU3RhdGVWYWx1ZTtcbiAgdHJhbnNpdGlvbjogQW5pbWF0aW9uVHJhbnNpdGlvbkZhY3Rvcnk7XG4gIHBsYXllcjogVHJhbnNpdGlvbkFuaW1hdGlvblBsYXllcjtcbiAgaXNGYWxsYmFja1RyYW5zaXRpb246IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjb25zdCBSRU1PVkFMX0ZMQUcgPSAnX19uZ19yZW1vdmVkJztcblxuZXhwb3J0IGludGVyZmFjZSBFbGVtZW50QW5pbWF0aW9uU3RhdGUge1xuICBzZXRGb3JSZW1vdmFsOiBib29sZWFuO1xuICBzZXRGb3JNb3ZlOiBib29sZWFuO1xuICBoYXNBbmltYXRpb246IGJvb2xlYW47XG4gIG5hbWVzcGFjZUlkOiBzdHJpbmc7XG4gIHJlbW92ZWRCZWZvcmVRdWVyaWVkOiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgU3RhdGVWYWx1ZSB7XG4gIHB1YmxpYyB2YWx1ZTogc3RyaW5nO1xuICBwdWJsaWMgb3B0aW9uczogQW5pbWF0aW9uT3B0aW9ucztcblxuICBnZXQgcGFyYW1zKCk6IHtba2V5OiBzdHJpbmddOiBhbnl9IHsgcmV0dXJuIHRoaXMub3B0aW9ucy5wYXJhbXMgYXN7W2tleTogc3RyaW5nXTogYW55fTsgfVxuXG4gIGNvbnN0cnVjdG9yKGlucHV0OiBhbnksIHB1YmxpYyBuYW1lc3BhY2VJZDogc3RyaW5nID0gJycpIHtcbiAgICBjb25zdCBpc09iaiA9IGlucHV0ICYmIGlucHV0Lmhhc093blByb3BlcnR5KCd2YWx1ZScpO1xuICAgIGNvbnN0IHZhbHVlID0gaXNPYmogPyBpbnB1dFsndmFsdWUnXSA6IGlucHV0O1xuICAgIHRoaXMudmFsdWUgPSBub3JtYWxpemVUcmlnZ2VyVmFsdWUodmFsdWUpO1xuICAgIGlmIChpc09iaikge1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IGNvcHlPYmooaW5wdXQgYXMgYW55KTtcbiAgICAgIGRlbGV0ZSBvcHRpb25zWyd2YWx1ZSddO1xuICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyBhcyBBbmltYXRpb25PcHRpb25zO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLm9wdGlvbnMucGFyYW1zKSB7XG4gICAgICB0aGlzLm9wdGlvbnMucGFyYW1zID0ge307XG4gICAgfVxuICB9XG5cbiAgYWJzb3JiT3B0aW9ucyhvcHRpb25zOiBBbmltYXRpb25PcHRpb25zKSB7XG4gICAgY29uc3QgbmV3UGFyYW1zID0gb3B0aW9ucy5wYXJhbXM7XG4gICAgaWYgKG5ld1BhcmFtcykge1xuICAgICAgY29uc3Qgb2xkUGFyYW1zID0gdGhpcy5vcHRpb25zLnBhcmFtcyAhO1xuICAgICAgT2JqZWN0LmtleXMobmV3UGFyYW1zKS5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgICBpZiAob2xkUGFyYW1zW3Byb3BdID09IG51bGwpIHtcbiAgICAgICAgICBvbGRQYXJhbXNbcHJvcF0gPSBuZXdQYXJhbXNbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY29uc3QgVk9JRF9WQUxVRSA9ICd2b2lkJztcbmV4cG9ydCBjb25zdCBERUZBVUxUX1NUQVRFX1ZBTFVFID0gbmV3IFN0YXRlVmFsdWUoVk9JRF9WQUxVRSk7XG5cbmV4cG9ydCBjbGFzcyBBbmltYXRpb25UcmFuc2l0aW9uTmFtZXNwYWNlIHtcbiAgcHVibGljIHBsYXllcnM6IFRyYW5zaXRpb25BbmltYXRpb25QbGF5ZXJbXSA9IFtdO1xuXG4gIHByaXZhdGUgX3RyaWdnZXJzOiB7W3RyaWdnZXJOYW1lOiBzdHJpbmddOiBBbmltYXRpb25UcmlnZ2VyfSA9IHt9O1xuICBwcml2YXRlIF9xdWV1ZTogUXVldWVJbnN0cnVjdGlvbltdID0gW107XG5cbiAgcHJpdmF0ZSBfZWxlbWVudExpc3RlbmVycyA9IG5ldyBNYXA8YW55LCBUcmlnZ2VyTGlzdGVuZXJbXT4oKTtcblxuICBwcml2YXRlIF9ob3N0Q2xhc3NOYW1lOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgaWQ6IHN0cmluZywgcHVibGljIGhvc3RFbGVtZW50OiBhbnksIHByaXZhdGUgX2VuZ2luZTogVHJhbnNpdGlvbkFuaW1hdGlvbkVuZ2luZSkge1xuICAgIHRoaXMuX2hvc3RDbGFzc05hbWUgPSAnbmctdG5zLScgKyBpZDtcbiAgICBhZGRDbGFzcyhob3N0RWxlbWVudCwgdGhpcy5faG9zdENsYXNzTmFtZSk7XG4gIH1cblxuICBsaXN0ZW4oZWxlbWVudDogYW55LCBuYW1lOiBzdHJpbmcsIHBoYXNlOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXZlbnQ6IGFueSkgPT4gYm9vbGVhbik6ICgpID0+IGFueSB7XG4gICAgaWYgKCF0aGlzLl90cmlnZ2Vycy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gbGlzdGVuIG9uIHRoZSBhbmltYXRpb24gdHJpZ2dlciBldmVudCBcIiR7XG4gICAgICAgICAgcGhhc2V9XCIgYmVjYXVzZSB0aGUgYW5pbWF0aW9uIHRyaWdnZXIgXCIke25hbWV9XCIgZG9lc25cXCd0IGV4aXN0IWApO1xuICAgIH1cblxuICAgIGlmIChwaGFzZSA9PSBudWxsIHx8IHBoYXNlLmxlbmd0aCA9PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBsaXN0ZW4gb24gdGhlIGFuaW1hdGlvbiB0cmlnZ2VyIFwiJHtcbiAgICAgICAgICBuYW1lfVwiIGJlY2F1c2UgdGhlIHByb3ZpZGVkIGV2ZW50IGlzIHVuZGVmaW5lZCFgKTtcbiAgICB9XG5cbiAgICBpZiAoIWlzVHJpZ2dlckV2ZW50VmFsaWQocGhhc2UpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBwcm92aWRlZCBhbmltYXRpb24gdHJpZ2dlciBldmVudCBcIiR7cGhhc2V9XCIgZm9yIHRoZSBhbmltYXRpb24gdHJpZ2dlciBcIiR7XG4gICAgICAgICAgbmFtZX1cIiBpcyBub3Qgc3VwcG9ydGVkIWApO1xuICAgIH1cblxuICAgIGNvbnN0IGxpc3RlbmVycyA9IGdldE9yU2V0QXNJbk1hcCh0aGlzLl9lbGVtZW50TGlzdGVuZXJzLCBlbGVtZW50LCBbXSk7XG4gICAgY29uc3QgZGF0YSA9IHtuYW1lLCBwaGFzZSwgY2FsbGJhY2t9O1xuICAgIGxpc3RlbmVycy5wdXNoKGRhdGEpO1xuXG4gICAgY29uc3QgdHJpZ2dlcnNXaXRoU3RhdGVzID0gZ2V0T3JTZXRBc0luTWFwKHRoaXMuX2VuZ2luZS5zdGF0ZXNCeUVsZW1lbnQsIGVsZW1lbnQsIHt9KTtcbiAgICBpZiAoIXRyaWdnZXJzV2l0aFN0YXRlcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgYWRkQ2xhc3MoZWxlbWVudCwgTkdfVFJJR0dFUl9DTEFTU05BTUUpO1xuICAgICAgYWRkQ2xhc3MoZWxlbWVudCwgTkdfVFJJR0dFUl9DTEFTU05BTUUgKyAnLScgKyBuYW1lKTtcbiAgICAgIHRyaWdnZXJzV2l0aFN0YXRlc1tuYW1lXSA9IERFRkFVTFRfU1RBVEVfVkFMVUU7XG4gICAgfVxuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIC8vIHRoZSBldmVudCBsaXN0ZW5lciBpcyByZW1vdmVkIEFGVEVSIHRoZSBmbHVzaCBoYXMgb2NjdXJyZWQgc3VjaFxuICAgICAgLy8gdGhhdCBsZWF2ZSBhbmltYXRpb25zIGNhbGxiYWNrcyBjYW4gZmlyZSAob3RoZXJ3aXNlIGlmIHRoZSBub2RlXG4gICAgICAvLyBpcyByZW1vdmVkIGluIGJldHdlZW4gdGhlbiB0aGUgbGlzdGVuZXJzIHdvdWxkIGJlIGRlcmVnaXN0ZXJlZClcbiAgICAgIHRoaXMuX2VuZ2luZS5hZnRlckZsdXNoKCgpID0+IHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBsaXN0ZW5lcnMuaW5kZXhPZihkYXRhKTtcbiAgICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgICBsaXN0ZW5lcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5fdHJpZ2dlcnNbbmFtZV0pIHtcbiAgICAgICAgICBkZWxldGUgdHJpZ2dlcnNXaXRoU3RhdGVzW25hbWVdO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICB9XG5cbiAgcmVnaXN0ZXIobmFtZTogc3RyaW5nLCBhc3Q6IEFuaW1hdGlvblRyaWdnZXIpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5fdHJpZ2dlcnNbbmFtZV0pIHtcbiAgICAgIC8vIHRocm93XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3RyaWdnZXJzW25hbWVdID0gYXN0O1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0VHJpZ2dlcihuYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCB0cmlnZ2VyID0gdGhpcy5fdHJpZ2dlcnNbbmFtZV07XG4gICAgaWYgKCF0cmlnZ2VyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBwcm92aWRlZCBhbmltYXRpb24gdHJpZ2dlciBcIiR7bmFtZX1cIiBoYXMgbm90IGJlZW4gcmVnaXN0ZXJlZCFgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRyaWdnZXI7XG4gIH1cblxuICB0cmlnZ2VyKGVsZW1lbnQ6IGFueSwgdHJpZ2dlck5hbWU6IHN0cmluZywgdmFsdWU6IGFueSwgZGVmYXVsdFRvRmFsbGJhY2s6IGJvb2xlYW4gPSB0cnVlKTpcbiAgICAgIFRyYW5zaXRpb25BbmltYXRpb25QbGF5ZXJ8dW5kZWZpbmVkIHtcbiAgICBjb25zdCB0cmlnZ2VyID0gdGhpcy5fZ2V0VHJpZ2dlcih0cmlnZ2VyTmFtZSk7XG4gICAgY29uc3QgcGxheWVyID0gbmV3IFRyYW5zaXRpb25BbmltYXRpb25QbGF5ZXIodGhpcy5pZCwgdHJpZ2dlck5hbWUsIGVsZW1lbnQpO1xuXG4gICAgbGV0IHRyaWdnZXJzV2l0aFN0YXRlcyA9IHRoaXMuX2VuZ2luZS5zdGF0ZXNCeUVsZW1lbnQuZ2V0KGVsZW1lbnQpO1xuICAgIGlmICghdHJpZ2dlcnNXaXRoU3RhdGVzKSB7XG4gICAgICBhZGRDbGFzcyhlbGVtZW50LCBOR19UUklHR0VSX0NMQVNTTkFNRSk7XG4gICAgICBhZGRDbGFzcyhlbGVtZW50LCBOR19UUklHR0VSX0NMQVNTTkFNRSArICctJyArIHRyaWdnZXJOYW1lKTtcbiAgICAgIHRoaXMuX2VuZ2luZS5zdGF0ZXNCeUVsZW1lbnQuc2V0KGVsZW1lbnQsIHRyaWdnZXJzV2l0aFN0YXRlcyA9IHt9KTtcbiAgICB9XG5cbiAgICBsZXQgZnJvbVN0YXRlID0gdHJpZ2dlcnNXaXRoU3RhdGVzW3RyaWdnZXJOYW1lXTtcbiAgICBjb25zdCB0b1N0YXRlID0gbmV3IFN0YXRlVmFsdWUodmFsdWUsIHRoaXMuaWQpO1xuXG4gICAgY29uc3QgaXNPYmogPSB2YWx1ZSAmJiB2YWx1ZS5oYXNPd25Qcm9wZXJ0eSgndmFsdWUnKTtcbiAgICBpZiAoIWlzT2JqICYmIGZyb21TdGF0ZSkge1xuICAgICAgdG9TdGF0ZS5hYnNvcmJPcHRpb25zKGZyb21TdGF0ZS5vcHRpb25zKTtcbiAgICB9XG5cbiAgICB0cmlnZ2Vyc1dpdGhTdGF0ZXNbdHJpZ2dlck5hbWVdID0gdG9TdGF0ZTtcblxuICAgIGlmICghZnJvbVN0YXRlKSB7XG4gICAgICBmcm9tU3RhdGUgPSBERUZBVUxUX1NUQVRFX1ZBTFVFO1xuICAgIH1cblxuICAgIGNvbnN0IGlzUmVtb3ZhbCA9IHRvU3RhdGUudmFsdWUgPT09IFZPSURfVkFMVUU7XG5cbiAgICAvLyBub3JtYWxseSB0aGlzIGlzbid0IHJlYWNoZWQgYnkgaGVyZSwgaG93ZXZlciwgaWYgYW4gb2JqZWN0IGV4cHJlc3Npb25cbiAgICAvLyBpcyBwYXNzZWQgaW4gdGhlbiBpdCBtYXkgYmUgYSBuZXcgb2JqZWN0IGVhY2ggdGltZS4gQ29tcGFyaW5nIHRoZSB2YWx1ZVxuICAgIC8vIGlzIGltcG9ydGFudCBzaW5jZSB0aGF0IHdpbGwgc3RheSB0aGUgc2FtZSBkZXNwaXRlIHRoZXJlIGJlaW5nIGEgbmV3IG9iamVjdC5cbiAgICAvLyBUaGUgcmVtb3ZhbCBhcmMgaGVyZSBpcyBzcGVjaWFsIGNhc2VkIGJlY2F1c2UgdGhlIHNhbWUgZWxlbWVudCBpcyB0cmlnZ2VyZWRcbiAgICAvLyB0d2ljZSBpbiB0aGUgZXZlbnQgdGhhdCBpdCBjb250YWlucyBhbmltYXRpb25zIG9uIHRoZSBvdXRlci9pbm5lciBwb3J0aW9uc1xuICAgIC8vIG9mIHRoZSBob3N0IGNvbnRhaW5lclxuICAgIGlmICghaXNSZW1vdmFsICYmIGZyb21TdGF0ZS52YWx1ZSA9PT0gdG9TdGF0ZS52YWx1ZSkge1xuICAgICAgLy8gdGhpcyBtZWFucyB0aGF0IGRlc3BpdGUgdGhlIHZhbHVlIG5vdCBjaGFuZ2luZywgc29tZSBpbm5lciBwYXJhbXNcbiAgICAgIC8vIGhhdmUgY2hhbmdlZCB3aGljaCBtZWFucyB0aGF0IHRoZSBhbmltYXRpb24gZmluYWwgc3R5bGVzIG5lZWQgdG8gYmUgYXBwbGllZFxuICAgICAgaWYgKCFvYmpFcXVhbHMoZnJvbVN0YXRlLnBhcmFtcywgdG9TdGF0ZS5wYXJhbXMpKSB7XG4gICAgICAgIGNvbnN0IGVycm9yczogYW55W10gPSBbXTtcbiAgICAgICAgY29uc3QgZnJvbVN0eWxlcyA9IHRyaWdnZXIubWF0Y2hTdHlsZXMoZnJvbVN0YXRlLnZhbHVlLCBmcm9tU3RhdGUucGFyYW1zLCBlcnJvcnMpO1xuICAgICAgICBjb25zdCB0b1N0eWxlcyA9IHRyaWdnZXIubWF0Y2hTdHlsZXModG9TdGF0ZS52YWx1ZSwgdG9TdGF0ZS5wYXJhbXMsIGVycm9ycyk7XG4gICAgICAgIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy5fZW5naW5lLnJlcG9ydEVycm9yKGVycm9ycyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fZW5naW5lLmFmdGVyRmx1c2goKCkgPT4ge1xuICAgICAgICAgICAgZXJhc2VTdHlsZXMoZWxlbWVudCwgZnJvbVN0eWxlcyk7XG4gICAgICAgICAgICBzZXRTdHlsZXMoZWxlbWVudCwgdG9TdHlsZXMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcGxheWVyc09uRWxlbWVudDogVHJhbnNpdGlvbkFuaW1hdGlvblBsYXllcltdID1cbiAgICAgICAgZ2V0T3JTZXRBc0luTWFwKHRoaXMuX2VuZ2luZS5wbGF5ZXJzQnlFbGVtZW50LCBlbGVtZW50LCBbXSk7XG4gICAgcGxheWVyc09uRWxlbWVudC5mb3JFYWNoKHBsYXllciA9PiB7XG4gICAgICAvLyBvbmx5IHJlbW92ZSB0aGUgcGxheWVyIGlmIGl0IGlzIHF1ZXVlZCBvbiB0aGUgRVhBQ1Qgc2FtZSB0cmlnZ2VyL25hbWVzcGFjZVxuICAgICAgLy8gd2Ugb25seSBhbHNvIGRlYWwgd2l0aCBxdWV1ZWQgcGxheWVycyBoZXJlIGJlY2F1c2UgaWYgdGhlIGFuaW1hdGlvbiBoYXNcbiAgICAgIC8vIHN0YXJ0ZWQgdGhlbiB3ZSB3YW50IHRvIGtlZXAgdGhlIHBsYXllciBhbGl2ZSB1bnRpbCB0aGUgZmx1c2ggaGFwcGVuc1xuICAgICAgLy8gKHdoaWNoIGlzIHdoZXJlIHRoZSBwcmV2aW91c1BsYXllcnMgYXJlIHBhc3NlZCBpbnRvIHRoZSBuZXcgcGFseWVyKVxuICAgICAgaWYgKHBsYXllci5uYW1lc3BhY2VJZCA9PSB0aGlzLmlkICYmIHBsYXllci50cmlnZ2VyTmFtZSA9PSB0cmlnZ2VyTmFtZSAmJiBwbGF5ZXIucXVldWVkKSB7XG4gICAgICAgIHBsYXllci5kZXN0cm95KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgdHJhbnNpdGlvbiA9XG4gICAgICAgIHRyaWdnZXIubWF0Y2hUcmFuc2l0aW9uKGZyb21TdGF0ZS52YWx1ZSwgdG9TdGF0ZS52YWx1ZSwgZWxlbWVudCwgdG9TdGF0ZS5wYXJhbXMpO1xuICAgIGxldCBpc0ZhbGxiYWNrVHJhbnNpdGlvbiA9IGZhbHNlO1xuICAgIGlmICghdHJhbnNpdGlvbikge1xuICAgICAgaWYgKCFkZWZhdWx0VG9GYWxsYmFjaykgcmV0dXJuO1xuICAgICAgdHJhbnNpdGlvbiA9IHRyaWdnZXIuZmFsbGJhY2tUcmFuc2l0aW9uO1xuICAgICAgaXNGYWxsYmFja1RyYW5zaXRpb24gPSB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMuX2VuZ2luZS50b3RhbFF1ZXVlZFBsYXllcnMrKztcbiAgICB0aGlzLl9xdWV1ZS5wdXNoKFxuICAgICAgICB7ZWxlbWVudCwgdHJpZ2dlck5hbWUsIHRyYW5zaXRpb24sIGZyb21TdGF0ZSwgdG9TdGF0ZSwgcGxheWVyLCBpc0ZhbGxiYWNrVHJhbnNpdGlvbn0pO1xuXG4gICAgaWYgKCFpc0ZhbGxiYWNrVHJhbnNpdGlvbikge1xuICAgICAgYWRkQ2xhc3MoZWxlbWVudCwgUVVFVUVEX0NMQVNTTkFNRSk7XG4gICAgICBwbGF5ZXIub25TdGFydCgoKSA9PiB7IHJlbW92ZUNsYXNzKGVsZW1lbnQsIFFVRVVFRF9DTEFTU05BTUUpOyB9KTtcbiAgICB9XG5cbiAgICBwbGF5ZXIub25Eb25lKCgpID0+IHtcbiAgICAgIGxldCBpbmRleCA9IHRoaXMucGxheWVycy5pbmRleE9mKHBsYXllcik7XG4gICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICB0aGlzLnBsYXllcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcGxheWVycyA9IHRoaXMuX2VuZ2luZS5wbGF5ZXJzQnlFbGVtZW50LmdldChlbGVtZW50KTtcbiAgICAgIGlmIChwbGF5ZXJzKSB7XG4gICAgICAgIGxldCBpbmRleCA9IHBsYXllcnMuaW5kZXhPZihwbGF5ZXIpO1xuICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICAgIHBsYXllcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5wbGF5ZXJzLnB1c2gocGxheWVyKTtcbiAgICBwbGF5ZXJzT25FbGVtZW50LnB1c2gocGxheWVyKTtcblxuICAgIHJldHVybiBwbGF5ZXI7XG4gIH1cblxuICBkZXJlZ2lzdGVyKG5hbWU6IHN0cmluZykge1xuICAgIGRlbGV0ZSB0aGlzLl90cmlnZ2Vyc1tuYW1lXTtcblxuICAgIHRoaXMuX2VuZ2luZS5zdGF0ZXNCeUVsZW1lbnQuZm9yRWFjaCgoc3RhdGVNYXAsIGVsZW1lbnQpID0+IHsgZGVsZXRlIHN0YXRlTWFwW25hbWVdOyB9KTtcblxuICAgIHRoaXMuX2VsZW1lbnRMaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXJzLCBlbGVtZW50KSA9PiB7XG4gICAgICB0aGlzLl9lbGVtZW50TGlzdGVuZXJzLnNldChcbiAgICAgICAgICBlbGVtZW50LCBsaXN0ZW5lcnMuZmlsdGVyKGVudHJ5ID0+IHsgcmV0dXJuIGVudHJ5Lm5hbWUgIT0gbmFtZTsgfSkpO1xuICAgIH0pO1xuICB9XG5cbiAgY2xlYXJFbGVtZW50Q2FjaGUoZWxlbWVudDogYW55KSB7XG4gICAgdGhpcy5fZW5naW5lLnN0YXRlc0J5RWxlbWVudC5kZWxldGUoZWxlbWVudCk7XG4gICAgdGhpcy5fZWxlbWVudExpc3RlbmVycy5kZWxldGUoZWxlbWVudCk7XG4gICAgY29uc3QgZWxlbWVudFBsYXllcnMgPSB0aGlzLl9lbmdpbmUucGxheWVyc0J5RWxlbWVudC5nZXQoZWxlbWVudCk7XG4gICAgaWYgKGVsZW1lbnRQbGF5ZXJzKSB7XG4gICAgICBlbGVtZW50UGxheWVycy5mb3JFYWNoKHBsYXllciA9PiBwbGF5ZXIuZGVzdHJveSgpKTtcbiAgICAgIHRoaXMuX2VuZ2luZS5wbGF5ZXJzQnlFbGVtZW50LmRlbGV0ZShlbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9zaWduYWxSZW1vdmFsRm9ySW5uZXJUcmlnZ2Vycyhyb290RWxlbWVudDogYW55LCBjb250ZXh0OiBhbnksIGFuaW1hdGU6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIC8vIGVtdWxhdGUgYSBsZWF2ZSBhbmltYXRpb24gZm9yIGFsbCBpbm5lciBub2RlcyB3aXRoaW4gdGhpcyBub2RlLlxuICAgIC8vIElmIHRoZXJlIGFyZSBubyBhbmltYXRpb25zIGZvdW5kIGZvciBhbnkgb2YgdGhlIG5vZGVzIHRoZW4gY2xlYXIgdGhlIGNhY2hlXG4gICAgLy8gZm9yIHRoZSBlbGVtZW50LlxuICAgIHRoaXMuX2VuZ2luZS5kcml2ZXIucXVlcnkocm9vdEVsZW1lbnQsIE5HX1RSSUdHRVJfU0VMRUNUT1IsIHRydWUpLmZvckVhY2goZWxtID0+IHtcbiAgICAgIC8vIHRoaXMgbWVhbnMgdGhhdCBhbiBpbm5lciByZW1vdmUoKSBvcGVyYXRpb24gaGFzIGFscmVhZHkga2lja2VkIG9mZlxuICAgICAgLy8gdGhlIGFuaW1hdGlvbiBvbiB0aGlzIGVsZW1lbnQuLi5cbiAgICAgIGlmIChlbG1bUkVNT1ZBTF9GTEFHXSkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBuYW1lc3BhY2VzID0gdGhpcy5fZW5naW5lLmZldGNoTmFtZXNwYWNlc0J5RWxlbWVudChlbG0pO1xuICAgICAgaWYgKG5hbWVzcGFjZXMuc2l6ZSkge1xuICAgICAgICBuYW1lc3BhY2VzLmZvckVhY2gobnMgPT4gbnMudHJpZ2dlckxlYXZlQW5pbWF0aW9uKGVsbSwgY29udGV4dCwgZmFsc2UsIHRydWUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2xlYXJFbGVtZW50Q2FjaGUoZWxtKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHRyaWdnZXJMZWF2ZUFuaW1hdGlvbihcbiAgICAgIGVsZW1lbnQ6IGFueSwgY29udGV4dDogYW55LCBkZXN0cm95QWZ0ZXJDb21wbGV0ZT86IGJvb2xlYW4sXG4gICAgICBkZWZhdWx0VG9GYWxsYmFjaz86IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgICBjb25zdCB0cmlnZ2VyU3RhdGVzID0gdGhpcy5fZW5naW5lLnN0YXRlc0J5RWxlbWVudC5nZXQoZWxlbWVudCk7XG4gICAgaWYgKHRyaWdnZXJTdGF0ZXMpIHtcbiAgICAgIGNvbnN0IHBsYXllcnM6IFRyYW5zaXRpb25BbmltYXRpb25QbGF5ZXJbXSA9IFtdO1xuICAgICAgT2JqZWN0LmtleXModHJpZ2dlclN0YXRlcykuZm9yRWFjaCh0cmlnZ2VyTmFtZSA9PiB7XG4gICAgICAgIC8vIHRoaXMgY2hlY2sgaXMgaGVyZSBpbiB0aGUgZXZlbnQgdGhhdCBhbiBlbGVtZW50IGlzIHJlbW92ZWRcbiAgICAgICAgLy8gdHdpY2UgKGJvdGggb24gdGhlIGhvc3QgbGV2ZWwgYW5kIHRoZSBjb21wb25lbnQgbGV2ZWwpXG4gICAgICAgIGlmICh0aGlzLl90cmlnZ2Vyc1t0cmlnZ2VyTmFtZV0pIHtcbiAgICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLnRyaWdnZXIoZWxlbWVudCwgdHJpZ2dlck5hbWUsIFZPSURfVkFMVUUsIGRlZmF1bHRUb0ZhbGxiYWNrKTtcbiAgICAgICAgICBpZiAocGxheWVyKSB7XG4gICAgICAgICAgICBwbGF5ZXJzLnB1c2gocGxheWVyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAocGxheWVycy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5fZW5naW5lLm1hcmtFbGVtZW50QXNSZW1vdmVkKHRoaXMuaWQsIGVsZW1lbnQsIHRydWUsIGNvbnRleHQpO1xuICAgICAgICBpZiAoZGVzdHJveUFmdGVyQ29tcGxldGUpIHtcbiAgICAgICAgICBvcHRpbWl6ZUdyb3VwUGxheWVyKHBsYXllcnMpLm9uRG9uZSgoKSA9PiB0aGlzLl9lbmdpbmUucHJvY2Vzc0xlYXZlTm9kZShlbGVtZW50KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByZXBhcmVMZWF2ZUFuaW1hdGlvbkxpc3RlbmVycyhlbGVtZW50OiBhbnkpIHtcbiAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9lbGVtZW50TGlzdGVuZXJzLmdldChlbGVtZW50KTtcbiAgICBpZiAobGlzdGVuZXJzKSB7XG4gICAgICBjb25zdCB2aXNpdGVkVHJpZ2dlcnMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGxpc3RlbmVyID0+IHtcbiAgICAgICAgY29uc3QgdHJpZ2dlck5hbWUgPSBsaXN0ZW5lci5uYW1lO1xuICAgICAgICBpZiAodmlzaXRlZFRyaWdnZXJzLmhhcyh0cmlnZ2VyTmFtZSkpIHJldHVybjtcbiAgICAgICAgdmlzaXRlZFRyaWdnZXJzLmFkZCh0cmlnZ2VyTmFtZSk7XG5cbiAgICAgICAgY29uc3QgdHJpZ2dlciA9IHRoaXMuX3RyaWdnZXJzW3RyaWdnZXJOYW1lXTtcbiAgICAgICAgY29uc3QgdHJhbnNpdGlvbiA9IHRyaWdnZXIuZmFsbGJhY2tUcmFuc2l0aW9uO1xuICAgICAgICBjb25zdCBlbGVtZW50U3RhdGVzID0gdGhpcy5fZW5naW5lLnN0YXRlc0J5RWxlbWVudC5nZXQoZWxlbWVudCkgITtcbiAgICAgICAgY29uc3QgZnJvbVN0YXRlID0gZWxlbWVudFN0YXRlc1t0cmlnZ2VyTmFtZV0gfHwgREVGQVVMVF9TVEFURV9WQUxVRTtcbiAgICAgICAgY29uc3QgdG9TdGF0ZSA9IG5ldyBTdGF0ZVZhbHVlKFZPSURfVkFMVUUpO1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSBuZXcgVHJhbnNpdGlvbkFuaW1hdGlvblBsYXllcih0aGlzLmlkLCB0cmlnZ2VyTmFtZSwgZWxlbWVudCk7XG5cbiAgICAgICAgdGhpcy5fZW5naW5lLnRvdGFsUXVldWVkUGxheWVycysrO1xuICAgICAgICB0aGlzLl9xdWV1ZS5wdXNoKHtcbiAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgIHRyaWdnZXJOYW1lLFxuICAgICAgICAgIHRyYW5zaXRpb24sXG4gICAgICAgICAgZnJvbVN0YXRlLFxuICAgICAgICAgIHRvU3RhdGUsXG4gICAgICAgICAgcGxheWVyLFxuICAgICAgICAgIGlzRmFsbGJhY2tUcmFuc2l0aW9uOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlTm9kZShlbGVtZW50OiBhbnksIGNvbnRleHQ6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IGVuZ2luZSA9IHRoaXMuX2VuZ2luZTtcblxuICAgIGlmIChlbGVtZW50LmNoaWxkRWxlbWVudENvdW50KSB7XG4gICAgICB0aGlzLl9zaWduYWxSZW1vdmFsRm9ySW5uZXJUcmlnZ2VycyhlbGVtZW50LCBjb250ZXh0LCB0cnVlKTtcbiAgICB9XG5cbiAgICAvLyB0aGlzIG1lYW5zIHRoYXQgYSAqID0+IFZPSUQgYW5pbWF0aW9uIHdhcyBkZXRlY3RlZCBhbmQga2lja2VkIG9mZlxuICAgIGlmICh0aGlzLnRyaWdnZXJMZWF2ZUFuaW1hdGlvbihlbGVtZW50LCBjb250ZXh0LCB0cnVlKSkgcmV0dXJuO1xuXG4gICAgLy8gZmluZCB0aGUgcGxheWVyIHRoYXQgaXMgYW5pbWF0aW5nIGFuZCBtYWtlIHN1cmUgdGhhdCB0aGVcbiAgICAvLyByZW1vdmFsIGlzIGRlbGF5ZWQgdW50aWwgdGhhdCBwbGF5ZXIgaGFzIGNvbXBsZXRlZFxuICAgIGxldCBjb250YWluc1BvdGVudGlhbFBhcmVudFRyYW5zaXRpb24gPSBmYWxzZTtcbiAgICBpZiAoZW5naW5lLnRvdGFsQW5pbWF0aW9ucykge1xuICAgICAgY29uc3QgY3VycmVudFBsYXllcnMgPVxuICAgICAgICAgIGVuZ2luZS5wbGF5ZXJzLmxlbmd0aCA/IGVuZ2luZS5wbGF5ZXJzQnlRdWVyaWVkRWxlbWVudC5nZXQoZWxlbWVudCkgOiBbXTtcblxuICAgICAgLy8gd2hlbiB0aGlzIGBpZiBzdGF0ZW1lbnRgIGRvZXMgbm90IGNvbnRpbnVlIGZvcndhcmQgaXQgbWVhbnMgdGhhdFxuICAgICAgLy8gYSBwcmV2aW91cyBhbmltYXRpb24gcXVlcnkgaGFzIHNlbGVjdGVkIHRoZSBjdXJyZW50IGVsZW1lbnQgYW5kXG4gICAgICAvLyBpcyBhbmltYXRpbmcgaXQuIEluIHRoaXMgc2l0dWF0aW9uIHdhbnQgdG8gY29udGludWUgZm9yd2FyZHMgYW5kXG4gICAgICAvLyBhbGxvdyB0aGUgZWxlbWVudCB0byBiZSBxdWV1ZWQgdXAgZm9yIGFuaW1hdGlvbiBsYXRlci5cbiAgICAgIGlmIChjdXJyZW50UGxheWVycyAmJiBjdXJyZW50UGxheWVycy5sZW5ndGgpIHtcbiAgICAgICAgY29udGFpbnNQb3RlbnRpYWxQYXJlbnRUcmFuc2l0aW9uID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBwYXJlbnQgPSBlbGVtZW50O1xuICAgICAgICB3aGlsZSAocGFyZW50ID0gcGFyZW50LnBhcmVudE5vZGUpIHtcbiAgICAgICAgICBjb25zdCB0cmlnZ2VycyA9IGVuZ2luZS5zdGF0ZXNCeUVsZW1lbnQuZ2V0KHBhcmVudCk7XG4gICAgICAgICAgaWYgKHRyaWdnZXJzKSB7XG4gICAgICAgICAgICBjb250YWluc1BvdGVudGlhbFBhcmVudFRyYW5zaXRpb24gPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gYXQgdGhpcyBzdGFnZSB3ZSBrbm93IHRoYXQgdGhlIGVsZW1lbnQgd2lsbCBlaXRoZXIgZ2V0IHJlbW92ZWRcbiAgICAvLyBkdXJpbmcgZmx1c2ggb3Igd2lsbCBiZSBwaWNrZWQgdXAgYnkgYSBwYXJlbnQgcXVlcnkuIEVpdGhlciB3YXlcbiAgICAvLyB3ZSBuZWVkIHRvIGZpcmUgdGhlIGxpc3RlbmVycyBmb3IgdGhpcyBlbGVtZW50IHdoZW4gaXQgRE9FUyBnZXRcbiAgICAvLyByZW1vdmVkIChvbmNlIHRoZSBxdWVyeSBwYXJlbnQgYW5pbWF0aW9uIGlzIGRvbmUgb3IgYWZ0ZXIgZmx1c2gpXG4gICAgdGhpcy5wcmVwYXJlTGVhdmVBbmltYXRpb25MaXN0ZW5lcnMoZWxlbWVudCk7XG5cbiAgICAvLyB3aGV0aGVyIG9yIG5vdCBhIHBhcmVudCBoYXMgYW4gYW5pbWF0aW9uIHdlIG5lZWQgdG8gZGVsYXkgdGhlIGRlZmVycmFsIG9mIHRoZSBsZWF2ZVxuICAgIC8vIG9wZXJhdGlvbiB1bnRpbCB3ZSBoYXZlIG1vcmUgaW5mb3JtYXRpb24gKHdoaWNoIHdlIGRvIGFmdGVyIGZsdXNoKCkgaGFzIGJlZW4gY2FsbGVkKVxuICAgIGlmIChjb250YWluc1BvdGVudGlhbFBhcmVudFRyYW5zaXRpb24pIHtcbiAgICAgIGVuZ2luZS5tYXJrRWxlbWVudEFzUmVtb3ZlZCh0aGlzLmlkLCBlbGVtZW50LCBmYWxzZSwgY29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHdlIGRvIHRoaXMgYWZ0ZXIgdGhlIGZsdXNoIGhhcyBvY2N1cnJlZCBzdWNoXG4gICAgICAvLyB0aGF0IHRoZSBjYWxsYmFja3MgY2FuIGJlIGZpcmVkXG4gICAgICBlbmdpbmUuYWZ0ZXJGbHVzaCgoKSA9PiB0aGlzLmNsZWFyRWxlbWVudENhY2hlKGVsZW1lbnQpKTtcbiAgICAgIGVuZ2luZS5kZXN0cm95SW5uZXJBbmltYXRpb25zKGVsZW1lbnQpO1xuICAgICAgZW5naW5lLl9vblJlbW92YWxDb21wbGV0ZShlbGVtZW50LCBjb250ZXh0KTtcbiAgICB9XG4gIH1cblxuICBpbnNlcnROb2RlKGVsZW1lbnQ6IGFueSwgcGFyZW50OiBhbnkpOiB2b2lkIHsgYWRkQ2xhc3MoZWxlbWVudCwgdGhpcy5faG9zdENsYXNzTmFtZSk7IH1cblxuICBkcmFpblF1ZXVlZFRyYW5zaXRpb25zKG1pY3JvdGFza0lkOiBudW1iZXIpOiBRdWV1ZUluc3RydWN0aW9uW10ge1xuICAgIGNvbnN0IGluc3RydWN0aW9uczogUXVldWVJbnN0cnVjdGlvbltdID0gW107XG4gICAgdGhpcy5fcXVldWUuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICBjb25zdCBwbGF5ZXIgPSBlbnRyeS5wbGF5ZXI7XG4gICAgICBpZiAocGxheWVyLmRlc3Ryb3llZCkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBlbGVtZW50ID0gZW50cnkuZWxlbWVudDtcbiAgICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2VsZW1lbnRMaXN0ZW5lcnMuZ2V0KGVsZW1lbnQpO1xuICAgICAgaWYgKGxpc3RlbmVycykge1xuICAgICAgICBsaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXI6IFRyaWdnZXJMaXN0ZW5lcikgPT4ge1xuICAgICAgICAgIGlmIChsaXN0ZW5lci5uYW1lID09IGVudHJ5LnRyaWdnZXJOYW1lKSB7XG4gICAgICAgICAgICBjb25zdCBiYXNlRXZlbnQgPSBtYWtlQW5pbWF0aW9uRXZlbnQoXG4gICAgICAgICAgICAgICAgZWxlbWVudCwgZW50cnkudHJpZ2dlck5hbWUsIGVudHJ5LmZyb21TdGF0ZS52YWx1ZSwgZW50cnkudG9TdGF0ZS52YWx1ZSk7XG4gICAgICAgICAgICAoYmFzZUV2ZW50IGFzIGFueSlbJ19kYXRhJ10gPSBtaWNyb3Rhc2tJZDtcbiAgICAgICAgICAgIGxpc3Rlbk9uUGxheWVyKGVudHJ5LnBsYXllciwgbGlzdGVuZXIucGhhc2UsIGJhc2VFdmVudCwgbGlzdGVuZXIuY2FsbGJhY2spO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwbGF5ZXIubWFya2VkRm9yRGVzdHJveSkge1xuICAgICAgICB0aGlzLl9lbmdpbmUuYWZ0ZXJGbHVzaCgoKSA9PiB7XG4gICAgICAgICAgLy8gbm93IHdlIGNhbiBkZXN0cm95IHRoZSBlbGVtZW50IHByb3Blcmx5IHNpbmNlIHRoZSBldmVudCBsaXN0ZW5lcnMgaGF2ZVxuICAgICAgICAgIC8vIGJlZW4gYm91bmQgdG8gdGhlIHBsYXllclxuICAgICAgICAgIHBsYXllci5kZXN0cm95KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5zdHJ1Y3Rpb25zLnB1c2goZW50cnkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5fcXVldWUgPSBbXTtcblxuICAgIHJldHVybiBpbnN0cnVjdGlvbnMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgLy8gaWYgZGVwQ291bnQgPT0gMCB0aGVtIG1vdmUgdG8gZnJvbnRcbiAgICAgIC8vIG90aGVyd2lzZSBpZiBhIGNvbnRhaW5zIGIgdGhlbiBtb3ZlIGJhY2tcbiAgICAgIGNvbnN0IGQwID0gYS50cmFuc2l0aW9uLmFzdC5kZXBDb3VudDtcbiAgICAgIGNvbnN0IGQxID0gYi50cmFuc2l0aW9uLmFzdC5kZXBDb3VudDtcbiAgICAgIGlmIChkMCA9PSAwIHx8IGQxID09IDApIHtcbiAgICAgICAgcmV0dXJuIGQwIC0gZDE7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5fZW5naW5lLmRyaXZlci5jb250YWluc0VsZW1lbnQoYS5lbGVtZW50LCBiLmVsZW1lbnQpID8gMSA6IC0xO1xuICAgIH0pO1xuICB9XG5cbiAgZGVzdHJveShjb250ZXh0OiBhbnkpIHtcbiAgICB0aGlzLnBsYXllcnMuZm9yRWFjaChwID0+IHAuZGVzdHJveSgpKTtcbiAgICB0aGlzLl9zaWduYWxSZW1vdmFsRm9ySW5uZXJUcmlnZ2Vycyh0aGlzLmhvc3RFbGVtZW50LCBjb250ZXh0KTtcbiAgfVxuXG4gIGVsZW1lbnRDb250YWluc0RhdGEoZWxlbWVudDogYW55KTogYm9vbGVhbiB7XG4gICAgbGV0IGNvbnRhaW5zRGF0YSA9IGZhbHNlO1xuICAgIGlmICh0aGlzLl9lbGVtZW50TGlzdGVuZXJzLmhhcyhlbGVtZW50KSkgY29udGFpbnNEYXRhID0gdHJ1ZTtcbiAgICBjb250YWluc0RhdGEgPVxuICAgICAgICAodGhpcy5fcXVldWUuZmluZChlbnRyeSA9PiBlbnRyeS5lbGVtZW50ID09PSBlbGVtZW50KSA/IHRydWUgOiBmYWxzZSkgfHwgY29udGFpbnNEYXRhO1xuICAgIHJldHVybiBjb250YWluc0RhdGE7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBRdWV1ZWRUcmFuc2l0aW9uIHtcbiAgZWxlbWVudDogYW55O1xuICBpbnN0cnVjdGlvbjogQW5pbWF0aW9uVHJhbnNpdGlvbkluc3RydWN0aW9uO1xuICBwbGF5ZXI6IFRyYW5zaXRpb25BbmltYXRpb25QbGF5ZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2l0aW9uQW5pbWF0aW9uRW5naW5lIHtcbiAgcHVibGljIHBsYXllcnM6IFRyYW5zaXRpb25BbmltYXRpb25QbGF5ZXJbXSA9IFtdO1xuICBwdWJsaWMgbmV3SG9zdEVsZW1lbnRzID0gbmV3IE1hcDxhbnksIEFuaW1hdGlvblRyYW5zaXRpb25OYW1lc3BhY2U+KCk7XG4gIHB1YmxpYyBwbGF5ZXJzQnlFbGVtZW50ID0gbmV3IE1hcDxhbnksIFRyYW5zaXRpb25BbmltYXRpb25QbGF5ZXJbXT4oKTtcbiAgcHVibGljIHBsYXllcnNCeVF1ZXJpZWRFbGVtZW50ID0gbmV3IE1hcDxhbnksIFRyYW5zaXRpb25BbmltYXRpb25QbGF5ZXJbXT4oKTtcbiAgcHVibGljIHN0YXRlc0J5RWxlbWVudCA9IG5ldyBNYXA8YW55LCB7W3RyaWdnZXJOYW1lOiBzdHJpbmddOiBTdGF0ZVZhbHVlfT4oKTtcbiAgcHVibGljIGRpc2FibGVkTm9kZXMgPSBuZXcgU2V0PGFueT4oKTtcblxuICBwdWJsaWMgdG90YWxBbmltYXRpb25zID0gMDtcbiAgcHVibGljIHRvdGFsUXVldWVkUGxheWVycyA9IDA7XG5cbiAgcHJpdmF0ZSBfbmFtZXNwYWNlTG9va3VwOiB7W2lkOiBzdHJpbmddOiBBbmltYXRpb25UcmFuc2l0aW9uTmFtZXNwYWNlfSA9IHt9O1xuICBwcml2YXRlIF9uYW1lc3BhY2VMaXN0OiBBbmltYXRpb25UcmFuc2l0aW9uTmFtZXNwYWNlW10gPSBbXTtcbiAgcHJpdmF0ZSBfZmx1c2hGbnM6ICgoKSA9PiBhbnkpW10gPSBbXTtcbiAgcHJpdmF0ZSBfd2hlblF1aWV0Rm5zOiAoKCkgPT4gYW55KVtdID0gW107XG5cbiAgcHVibGljIG5hbWVzcGFjZXNCeUhvc3RFbGVtZW50ID0gbmV3IE1hcDxhbnksIEFuaW1hdGlvblRyYW5zaXRpb25OYW1lc3BhY2U+KCk7XG4gIHB1YmxpYyBjb2xsZWN0ZWRFbnRlckVsZW1lbnRzOiBhbnlbXSA9IFtdO1xuICBwdWJsaWMgY29sbGVjdGVkTGVhdmVFbGVtZW50czogYW55W10gPSBbXTtcblxuICAvLyB0aGlzIG1ldGhvZCBpcyBkZXNpZ25lZCB0byBiZSBvdmVycmlkZGVuIGJ5IHRoZSBjb2RlIHRoYXQgdXNlcyB0aGlzIGVuZ2luZVxuICBwdWJsaWMgb25SZW1vdmFsQ29tcGxldGUgPSAoZWxlbWVudDogYW55LCBjb250ZXh0OiBhbnkpID0+IHt9O1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX29uUmVtb3ZhbENvbXBsZXRlKGVsZW1lbnQ6IGFueSwgY29udGV4dDogYW55KSB7IHRoaXMub25SZW1vdmFsQ29tcGxldGUoZWxlbWVudCwgY29udGV4dCk7IH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBib2R5Tm9kZTogYW55LCBwdWJsaWMgZHJpdmVyOiBBbmltYXRpb25Ecml2ZXIsXG4gICAgICBwcml2YXRlIF9ub3JtYWxpemVyOiBBbmltYXRpb25TdHlsZU5vcm1hbGl6ZXIpIHt9XG5cbiAgZ2V0IHF1ZXVlZFBsYXllcnMoKTogVHJhbnNpdGlvbkFuaW1hdGlvblBsYXllcltdIHtcbiAgICBjb25zdCBwbGF5ZXJzOiBUcmFuc2l0aW9uQW5pbWF0aW9uUGxheWVyW10gPSBbXTtcbiAgICB0aGlzLl9uYW1lc3BhY2VMaXN0LmZvckVhY2gobnMgPT4ge1xuICAgICAgbnMucGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XG4gICAgICAgIGlmIChwbGF5ZXIucXVldWVkKSB7XG4gICAgICAgICAgcGxheWVycy5wdXNoKHBsYXllcik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBwbGF5ZXJzO1xuICB9XG5cbiAgY3JlYXRlTmFtZXNwYWNlKG5hbWVzcGFjZUlkOiBzdHJpbmcsIGhvc3RFbGVtZW50OiBhbnkpIHtcbiAgICBjb25zdCBucyA9IG5ldyBBbmltYXRpb25UcmFuc2l0aW9uTmFtZXNwYWNlKG5hbWVzcGFjZUlkLCBob3N0RWxlbWVudCwgdGhpcyk7XG4gICAgaWYgKGhvc3RFbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICAgIHRoaXMuX2JhbGFuY2VOYW1lc3BhY2VMaXN0KG5zLCBob3N0RWxlbWVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGRlZmVyIHRoaXMgbGF0ZXIgdW50aWwgZmx1c2ggZHVyaW5nIHdoZW4gdGhlIGhvc3QgZWxlbWVudCBoYXNcbiAgICAgIC8vIGJlZW4gaW5zZXJ0ZWQgc28gdGhhdCB3ZSBrbm93IGV4YWN0bHkgd2hlcmUgdG8gcGxhY2UgaXQgaW5cbiAgICAgIC8vIHRoZSBuYW1lc3BhY2UgbGlzdFxuICAgICAgdGhpcy5uZXdIb3N0RWxlbWVudHMuc2V0KGhvc3RFbGVtZW50LCBucyk7XG5cbiAgICAgIC8vIGdpdmVuIHRoYXQgdGhpcyBob3N0IGVsZW1lbnQgaXMgYXBhcnQgb2YgdGhlIGFuaW1hdGlvbiBjb2RlLCBpdFxuICAgICAgLy8gbWF5IG9yIG1heSBub3QgYmUgaW5zZXJ0ZWQgYnkgYSBwYXJlbnQgbm9kZSB0aGF0IGlzIGFuIG9mIGFuXG4gICAgICAvLyBhbmltYXRpb24gcmVuZGVyZXIgdHlwZS4gSWYgdGhpcyBoYXBwZW5zIHRoZW4gd2UgY2FuIHN0aWxsIGhhdmVcbiAgICAgIC8vIGFjY2VzcyB0byB0aGlzIGl0ZW0gd2hlbiB3ZSBxdWVyeSBmb3IgOmVudGVyIG5vZGVzLiBJZiB0aGUgcGFyZW50XG4gICAgICAvLyBpcyBhIHJlbmRlcmVyIHRoZW4gdGhlIHNldCBkYXRhLXN0cnVjdHVyZSB3aWxsIG5vcm1hbGl6ZSB0aGUgZW50cnlcbiAgICAgIHRoaXMuY29sbGVjdEVudGVyRWxlbWVudChob3N0RWxlbWVudCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9uYW1lc3BhY2VMb29rdXBbbmFtZXNwYWNlSWRdID0gbnM7XG4gIH1cblxuICBwcml2YXRlIF9iYWxhbmNlTmFtZXNwYWNlTGlzdChuczogQW5pbWF0aW9uVHJhbnNpdGlvbk5hbWVzcGFjZSwgaG9zdEVsZW1lbnQ6IGFueSkge1xuICAgIGNvbnN0IGxpbWl0ID0gdGhpcy5fbmFtZXNwYWNlTGlzdC5sZW5ndGggLSAxO1xuICAgIGlmIChsaW1pdCA+PSAwKSB7XG4gICAgICBsZXQgZm91bmQgPSBmYWxzZTtcbiAgICAgIGZvciAobGV0IGkgPSBsaW1pdDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgY29uc3QgbmV4dE5hbWVzcGFjZSA9IHRoaXMuX25hbWVzcGFjZUxpc3RbaV07XG4gICAgICAgIGlmICh0aGlzLmRyaXZlci5jb250YWluc0VsZW1lbnQobmV4dE5hbWVzcGFjZS5ob3N0RWxlbWVudCwgaG9zdEVsZW1lbnQpKSB7XG4gICAgICAgICAgdGhpcy5fbmFtZXNwYWNlTGlzdC5zcGxpY2UoaSArIDEsIDAsIG5zKTtcbiAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgdGhpcy5fbmFtZXNwYWNlTGlzdC5zcGxpY2UoMCwgMCwgbnMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9uYW1lc3BhY2VMaXN0LnB1c2gobnMpO1xuICAgIH1cblxuICAgIHRoaXMubmFtZXNwYWNlc0J5SG9zdEVsZW1lbnQuc2V0KGhvc3RFbGVtZW50LCBucyk7XG4gICAgcmV0dXJuIG5zO1xuICB9XG5cbiAgcmVnaXN0ZXIobmFtZXNwYWNlSWQ6IHN0cmluZywgaG9zdEVsZW1lbnQ6IGFueSkge1xuICAgIGxldCBucyA9IHRoaXMuX25hbWVzcGFjZUxvb2t1cFtuYW1lc3BhY2VJZF07XG4gICAgaWYgKCFucykge1xuICAgICAgbnMgPSB0aGlzLmNyZWF0ZU5hbWVzcGFjZShuYW1lc3BhY2VJZCwgaG9zdEVsZW1lbnQpO1xuICAgIH1cbiAgICByZXR1cm4gbnM7XG4gIH1cblxuICByZWdpc3RlclRyaWdnZXIobmFtZXNwYWNlSWQ6IHN0cmluZywgbmFtZTogc3RyaW5nLCB0cmlnZ2VyOiBBbmltYXRpb25UcmlnZ2VyKSB7XG4gICAgbGV0IG5zID0gdGhpcy5fbmFtZXNwYWNlTG9va3VwW25hbWVzcGFjZUlkXTtcbiAgICBpZiAobnMgJiYgbnMucmVnaXN0ZXIobmFtZSwgdHJpZ2dlcikpIHtcbiAgICAgIHRoaXMudG90YWxBbmltYXRpb25zKys7XG4gICAgfVxuICB9XG5cbiAgZGVzdHJveShuYW1lc3BhY2VJZDogc3RyaW5nLCBjb250ZXh0OiBhbnkpIHtcbiAgICBpZiAoIW5hbWVzcGFjZUlkKSByZXR1cm47XG5cbiAgICBjb25zdCBucyA9IHRoaXMuX2ZldGNoTmFtZXNwYWNlKG5hbWVzcGFjZUlkKTtcblxuICAgIHRoaXMuYWZ0ZXJGbHVzaCgoKSA9PiB7XG4gICAgICB0aGlzLm5hbWVzcGFjZXNCeUhvc3RFbGVtZW50LmRlbGV0ZShucy5ob3N0RWxlbWVudCk7XG4gICAgICBkZWxldGUgdGhpcy5fbmFtZXNwYWNlTG9va3VwW25hbWVzcGFjZUlkXTtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fbmFtZXNwYWNlTGlzdC5pbmRleE9mKG5zKTtcbiAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgIHRoaXMuX25hbWVzcGFjZUxpc3Quc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuYWZ0ZXJGbHVzaEFuaW1hdGlvbnNEb25lKCgpID0+IG5zLmRlc3Ryb3koY29udGV4dCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZmV0Y2hOYW1lc3BhY2UoaWQ6IHN0cmluZykgeyByZXR1cm4gdGhpcy5fbmFtZXNwYWNlTG9va3VwW2lkXTsgfVxuXG4gIGZldGNoTmFtZXNwYWNlc0J5RWxlbWVudChlbGVtZW50OiBhbnkpOiBTZXQ8QW5pbWF0aW9uVHJhbnNpdGlvbk5hbWVzcGFjZT4ge1xuICAgIC8vIG5vcm1hbGx5IHRoZXJlIHNob3VsZCBvbmx5IGJlIG9uZSBuYW1lc3BhY2UgcGVyIGVsZW1lbnQsIGhvd2V2ZXJcbiAgICAvLyBpZiBAdHJpZ2dlcnMgYXJlIHBsYWNlZCBvbiBib3RoIHRoZSBjb21wb25lbnQgZWxlbWVudCBhbmQgdGhlblxuICAgIC8vIGl0cyBob3N0IGVsZW1lbnQgKHdpdGhpbiB0aGUgY29tcG9uZW50IGNvZGUpIHRoZW4gdGhlcmUgd2lsbCBiZVxuICAgIC8vIHR3byBuYW1lc3BhY2VzIHJldHVybmVkLiBXZSB1c2UgYSBzZXQgaGVyZSB0byBzaW1wbHkgdGhlIGRlZHVwZVxuICAgIC8vIG9mIG5hbWVzcGFjZXMgaW5jYXNlIHRoZXJlIGFyZSBtdWx0aXBsZSB0cmlnZ2VycyBib3RoIHRoZSBlbG0gYW5kIGhvc3RcbiAgICBjb25zdCBuYW1lc3BhY2VzID0gbmV3IFNldDxBbmltYXRpb25UcmFuc2l0aW9uTmFtZXNwYWNlPigpO1xuICAgIGNvbnN0IGVsZW1lbnRTdGF0ZXMgPSB0aGlzLnN0YXRlc0J5RWxlbWVudC5nZXQoZWxlbWVudCk7XG4gICAgaWYgKGVsZW1lbnRTdGF0ZXMpIHtcbiAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhlbGVtZW50U3RhdGVzKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBuc0lkID0gZWxlbWVudFN0YXRlc1trZXlzW2ldXS5uYW1lc3BhY2VJZDtcbiAgICAgICAgaWYgKG5zSWQpIHtcbiAgICAgICAgICBjb25zdCBucyA9IHRoaXMuX2ZldGNoTmFtZXNwYWNlKG5zSWQpO1xuICAgICAgICAgIGlmIChucykge1xuICAgICAgICAgICAgbmFtZXNwYWNlcy5hZGQobnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmFtZXNwYWNlcztcbiAgfVxuXG4gIHRyaWdnZXIobmFtZXNwYWNlSWQ6IHN0cmluZywgZWxlbWVudDogYW55LCBuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpOiBib29sZWFuIHtcbiAgICBpZiAoaXNFbGVtZW50Tm9kZShlbGVtZW50KSkge1xuICAgICAgY29uc3QgbnMgPSB0aGlzLl9mZXRjaE5hbWVzcGFjZShuYW1lc3BhY2VJZCk7XG4gICAgICBpZiAobnMpIHtcbiAgICAgICAgbnMudHJpZ2dlcihlbGVtZW50LCBuYW1lLCB2YWx1ZSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpbnNlcnROb2RlKG5hbWVzcGFjZUlkOiBzdHJpbmcsIGVsZW1lbnQ6IGFueSwgcGFyZW50OiBhbnksIGluc2VydEJlZm9yZTogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmICghaXNFbGVtZW50Tm9kZShlbGVtZW50KSkgcmV0dXJuO1xuXG4gICAgLy8gc3BlY2lhbCBjYXNlIGZvciB3aGVuIGFuIGVsZW1lbnQgaXMgcmVtb3ZlZCBhbmQgcmVpbnNlcnRlZCAobW92ZSBvcGVyYXRpb24pXG4gICAgLy8gd2hlbiB0aGlzIG9jY3VycyB3ZSBkbyBub3Qgd2FudCB0byB1c2UgdGhlIGVsZW1lbnQgZm9yIGRlbGV0aW9uIGxhdGVyXG4gICAgY29uc3QgZGV0YWlscyA9IGVsZW1lbnRbUkVNT1ZBTF9GTEFHXSBhcyBFbGVtZW50QW5pbWF0aW9uU3RhdGU7XG4gICAgaWYgKGRldGFpbHMgJiYgZGV0YWlscy5zZXRGb3JSZW1vdmFsKSB7XG4gICAgICBkZXRhaWxzLnNldEZvclJlbW92YWwgPSBmYWxzZTtcbiAgICAgIGRldGFpbHMuc2V0Rm9yTW92ZSA9IHRydWU7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuY29sbGVjdGVkTGVhdmVFbGVtZW50cy5pbmRleE9mKGVsZW1lbnQpO1xuICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgdGhpcy5jb2xsZWN0ZWRMZWF2ZUVsZW1lbnRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gaW4gdGhlIGV2ZW50IHRoYXQgdGhlIG5hbWVzcGFjZUlkIGlzIGJsYW5rIHRoZW4gdGhlIGNhbGxlclxuICAgIC8vIGNvZGUgZG9lcyBub3QgY29udGFpbiBhbnkgYW5pbWF0aW9uIGNvZGUgaW4gaXQsIGJ1dCBpdCBpc1xuICAgIC8vIGp1c3QgYmVpbmcgY2FsbGVkIHNvIHRoYXQgdGhlIG5vZGUgaXMgbWFya2VkIGFzIGJlaW5nIGluc2VydGVkXG4gICAgaWYgKG5hbWVzcGFjZUlkKSB7XG4gICAgICBjb25zdCBucyA9IHRoaXMuX2ZldGNoTmFtZXNwYWNlKG5hbWVzcGFjZUlkKTtcbiAgICAgIC8vIFRoaXMgaWYtc3RhdGVtZW50IGlzIGEgd29ya2Fyb3VuZCBmb3Igcm91dGVyIGlzc3VlICMyMTk0Ny5cbiAgICAgIC8vIFRoZSByb3V0ZXIgc29tZXRpbWVzIGhpdHMgYSByYWNlIGNvbmRpdGlvbiB3aGVyZSB3aGlsZSBhIHJvdXRlXG4gICAgICAvLyBpcyBiZWluZyBpbnN0YW50aWF0ZWQgYSBuZXcgbmF2aWdhdGlvbiBhcnJpdmVzLCB0cmlnZ2VyaW5nIGxlYXZlXG4gICAgICAvLyBhbmltYXRpb24gb2YgRE9NIHRoYXQgaGFzIG5vdCBiZWVuIGZ1bGx5IGluaXRpYWxpemVkLCB1bnRpbCB0aGlzXG4gICAgICAvLyBpcyByZXNvbHZlZCwgd2UgbmVlZCB0byBoYW5kbGUgdGhlIHNjZW5hcmlvIHdoZW4gRE9NIGlzIG5vdCBpbiBhXG4gICAgICAvLyBjb25zaXN0ZW50IHN0YXRlIGR1cmluZyB0aGUgYW5pbWF0aW9uLlxuICAgICAgaWYgKG5zKSB7XG4gICAgICAgIG5zLmluc2VydE5vZGUoZWxlbWVudCwgcGFyZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBvbmx5ICpkaXJlY3RpdmVzIGFuZCBob3N0IGVsZW1lbnRzIGFyZSBpbnNlcnRlZCBiZWZvcmVcbiAgICBpZiAoaW5zZXJ0QmVmb3JlKSB7XG4gICAgICB0aGlzLmNvbGxlY3RFbnRlckVsZW1lbnQoZWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgY29sbGVjdEVudGVyRWxlbWVudChlbGVtZW50OiBhbnkpIHsgdGhpcy5jb2xsZWN0ZWRFbnRlckVsZW1lbnRzLnB1c2goZWxlbWVudCk7IH1cblxuICBtYXJrRWxlbWVudEFzRGlzYWJsZWQoZWxlbWVudDogYW55LCB2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgaWYgKCF0aGlzLmRpc2FibGVkTm9kZXMuaGFzKGVsZW1lbnQpKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZWROb2Rlcy5hZGQoZWxlbWVudCk7XG4gICAgICAgIGFkZENsYXNzKGVsZW1lbnQsIERJU0FCTEVEX0NMQVNTTkFNRSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLmRpc2FibGVkTm9kZXMuaGFzKGVsZW1lbnQpKSB7XG4gICAgICB0aGlzLmRpc2FibGVkTm9kZXMuZGVsZXRlKGVsZW1lbnQpO1xuICAgICAgcmVtb3ZlQ2xhc3MoZWxlbWVudCwgRElTQUJMRURfQ0xBU1NOQU1FKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmVOb2RlKG5hbWVzcGFjZUlkOiBzdHJpbmcsIGVsZW1lbnQ6IGFueSwgY29udGV4dDogYW55KTogdm9pZCB7XG4gICAgaWYgKCFpc0VsZW1lbnROb2RlKGVsZW1lbnQpKSB7XG4gICAgICB0aGlzLl9vblJlbW92YWxDb21wbGV0ZShlbGVtZW50LCBjb250ZXh0KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBucyA9IG5hbWVzcGFjZUlkID8gdGhpcy5fZmV0Y2hOYW1lc3BhY2UobmFtZXNwYWNlSWQpIDogbnVsbDtcbiAgICBpZiAobnMpIHtcbiAgICAgIG5zLnJlbW92ZU5vZGUoZWxlbWVudCwgY29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWFya0VsZW1lbnRBc1JlbW92ZWQobmFtZXNwYWNlSWQsIGVsZW1lbnQsIGZhbHNlLCBjb250ZXh0KTtcbiAgICB9XG4gIH1cblxuICBtYXJrRWxlbWVudEFzUmVtb3ZlZChuYW1lc3BhY2VJZDogc3RyaW5nLCBlbGVtZW50OiBhbnksIGhhc0FuaW1hdGlvbj86IGJvb2xlYW4sIGNvbnRleHQ/OiBhbnkpIHtcbiAgICB0aGlzLmNvbGxlY3RlZExlYXZlRWxlbWVudHMucHVzaChlbGVtZW50KTtcbiAgICBlbGVtZW50W1JFTU9WQUxfRkxBR10gPSB7XG4gICAgICBuYW1lc3BhY2VJZCxcbiAgICAgIHNldEZvclJlbW92YWw6IGNvbnRleHQsIGhhc0FuaW1hdGlvbixcbiAgICAgIHJlbW92ZWRCZWZvcmVRdWVyaWVkOiBmYWxzZVxuICAgIH07XG4gIH1cblxuICBsaXN0ZW4oXG4gICAgICBuYW1lc3BhY2VJZDogc3RyaW5nLCBlbGVtZW50OiBhbnksIG5hbWU6IHN0cmluZywgcGhhc2U6IHN0cmluZyxcbiAgICAgIGNhbGxiYWNrOiAoZXZlbnQ6IGFueSkgPT4gYm9vbGVhbik6ICgpID0+IGFueSB7XG4gICAgaWYgKGlzRWxlbWVudE5vZGUoZWxlbWVudCkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9mZXRjaE5hbWVzcGFjZShuYW1lc3BhY2VJZCkubGlzdGVuKGVsZW1lbnQsIG5hbWUsIHBoYXNlLCBjYWxsYmFjayk7XG4gICAgfVxuICAgIHJldHVybiAoKSA9PiB7fTtcbiAgfVxuXG4gIHByaXZhdGUgX2J1aWxkSW5zdHJ1Y3Rpb24oXG4gICAgICBlbnRyeTogUXVldWVJbnN0cnVjdGlvbiwgc3ViVGltZWxpbmVzOiBFbGVtZW50SW5zdHJ1Y3Rpb25NYXAsIGVudGVyQ2xhc3NOYW1lOiBzdHJpbmcsXG4gICAgICBsZWF2ZUNsYXNzTmFtZTogc3RyaW5nLCBza2lwQnVpbGRBc3Q/OiBib29sZWFuKSB7XG4gICAgcmV0dXJuIGVudHJ5LnRyYW5zaXRpb24uYnVpbGQoXG4gICAgICAgIHRoaXMuZHJpdmVyLCBlbnRyeS5lbGVtZW50LCBlbnRyeS5mcm9tU3RhdGUudmFsdWUsIGVudHJ5LnRvU3RhdGUudmFsdWUsIGVudGVyQ2xhc3NOYW1lLFxuICAgICAgICBsZWF2ZUNsYXNzTmFtZSwgZW50cnkuZnJvbVN0YXRlLm9wdGlvbnMsIGVudHJ5LnRvU3RhdGUub3B0aW9ucywgc3ViVGltZWxpbmVzLCBza2lwQnVpbGRBc3QpO1xuICB9XG5cbiAgZGVzdHJveUlubmVyQW5pbWF0aW9ucyhjb250YWluZXJFbGVtZW50OiBhbnkpIHtcbiAgICBsZXQgZWxlbWVudHMgPSB0aGlzLmRyaXZlci5xdWVyeShjb250YWluZXJFbGVtZW50LCBOR19UUklHR0VSX1NFTEVDVE9SLCB0cnVlKTtcbiAgICBlbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4gdGhpcy5kZXN0cm95QWN0aXZlQW5pbWF0aW9uc0ZvckVsZW1lbnQoZWxlbWVudCkpO1xuXG4gICAgaWYgKHRoaXMucGxheWVyc0J5UXVlcmllZEVsZW1lbnQuc2l6ZSA9PSAwKSByZXR1cm47XG5cbiAgICBlbGVtZW50cyA9IHRoaXMuZHJpdmVyLnF1ZXJ5KGNvbnRhaW5lckVsZW1lbnQsIE5HX0FOSU1BVElOR19TRUxFQ1RPUiwgdHJ1ZSk7XG4gICAgZWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IHRoaXMuZmluaXNoQWN0aXZlUXVlcmllZEFuaW1hdGlvbk9uRWxlbWVudChlbGVtZW50KSk7XG4gIH1cblxuICBkZXN0cm95QWN0aXZlQW5pbWF0aW9uc0ZvckVsZW1lbnQoZWxlbWVudDogYW55KSB7XG4gICAgY29uc3QgcGxheWVycyA9IHRoaXMucGxheWVyc0J5RWxlbWVudC5nZXQoZWxlbWVudCk7XG4gICAgaWYgKHBsYXllcnMpIHtcbiAgICAgIHBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4ge1xuICAgICAgICAvLyBzcGVjaWFsIGNhc2UgZm9yIHdoZW4gYW4gZWxlbWVudCBpcyBzZXQgZm9yIGRlc3RydWN0aW9uLCBidXQgaGFzbid0IHN0YXJ0ZWQuXG4gICAgICAgIC8vIGluIHRoaXMgc2l0dWF0aW9uIHdlIHdhbnQgdG8gZGVsYXkgdGhlIGRlc3RydWN0aW9uIHVudGlsIHRoZSBmbHVzaCBvY2N1cnNcbiAgICAgICAgLy8gc28gdGhhdCBhbnkgZXZlbnQgbGlzdGVuZXJzIGF0dGFjaGVkIHRvIHRoZSBwbGF5ZXIgYXJlIHRyaWdnZXJlZC5cbiAgICAgICAgaWYgKHBsYXllci5xdWV1ZWQpIHtcbiAgICAgICAgICBwbGF5ZXIubWFya2VkRm9yRGVzdHJveSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGxheWVyLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZmluaXNoQWN0aXZlUXVlcmllZEFuaW1hdGlvbk9uRWxlbWVudChlbGVtZW50OiBhbnkpIHtcbiAgICBjb25zdCBwbGF5ZXJzID0gdGhpcy5wbGF5ZXJzQnlRdWVyaWVkRWxlbWVudC5nZXQoZWxlbWVudCk7XG4gICAgaWYgKHBsYXllcnMpIHtcbiAgICAgIHBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4gcGxheWVyLmZpbmlzaCgpKTtcbiAgICB9XG4gIH1cblxuICB3aGVuUmVuZGVyaW5nRG9uZSgpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGlmICh0aGlzLnBsYXllcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBvcHRpbWl6ZUdyb3VwUGxheWVyKHRoaXMucGxheWVycykub25Eb25lKCgpID0+IHJlc29sdmUoKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcm9jZXNzTGVhdmVOb2RlKGVsZW1lbnQ6IGFueSkge1xuICAgIGNvbnN0IGRldGFpbHMgPSBlbGVtZW50W1JFTU9WQUxfRkxBR10gYXMgRWxlbWVudEFuaW1hdGlvblN0YXRlO1xuICAgIGlmIChkZXRhaWxzICYmIGRldGFpbHMuc2V0Rm9yUmVtb3ZhbCkge1xuICAgICAgLy8gdGhpcyB3aWxsIHByZXZlbnQgaXQgZnJvbSByZW1vdmluZyBpdCB0d2ljZVxuICAgICAgZWxlbWVudFtSRU1PVkFMX0ZMQUddID0gTlVMTF9SRU1PVkFMX1NUQVRFO1xuICAgICAgaWYgKGRldGFpbHMubmFtZXNwYWNlSWQpIHtcbiAgICAgICAgdGhpcy5kZXN0cm95SW5uZXJBbmltYXRpb25zKGVsZW1lbnQpO1xuICAgICAgICBjb25zdCBucyA9IHRoaXMuX2ZldGNoTmFtZXNwYWNlKGRldGFpbHMubmFtZXNwYWNlSWQpO1xuICAgICAgICBpZiAobnMpIHtcbiAgICAgICAgICBucy5jbGVhckVsZW1lbnRDYWNoZShlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5fb25SZW1vdmFsQ29tcGxldGUoZWxlbWVudCwgZGV0YWlscy5zZXRGb3JSZW1vdmFsKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kcml2ZXIubWF0Y2hlc0VsZW1lbnQoZWxlbWVudCwgRElTQUJMRURfU0VMRUNUT1IpKSB7XG4gICAgICB0aGlzLm1hcmtFbGVtZW50QXNEaXNhYmxlZChlbGVtZW50LCBmYWxzZSk7XG4gICAgfVxuXG4gICAgdGhpcy5kcml2ZXIucXVlcnkoZWxlbWVudCwgRElTQUJMRURfU0VMRUNUT1IsIHRydWUpLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICB0aGlzLm1hcmtFbGVtZW50QXNEaXNhYmxlZChlbGVtZW50LCBmYWxzZSk7XG4gICAgfSk7XG4gIH1cblxuICBmbHVzaChtaWNyb3Rhc2tJZDogbnVtYmVyID0gLTEpIHtcbiAgICBsZXQgcGxheWVyczogQW5pbWF0aW9uUGxheWVyW10gPSBbXTtcbiAgICBpZiAodGhpcy5uZXdIb3N0RWxlbWVudHMuc2l6ZSkge1xuICAgICAgdGhpcy5uZXdIb3N0RWxlbWVudHMuZm9yRWFjaCgobnMsIGVsZW1lbnQpID0+IHRoaXMuX2JhbGFuY2VOYW1lc3BhY2VMaXN0KG5zLCBlbGVtZW50KSk7XG4gICAgICB0aGlzLm5ld0hvc3RFbGVtZW50cy5jbGVhcigpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnRvdGFsQW5pbWF0aW9ucyAmJiB0aGlzLmNvbGxlY3RlZEVudGVyRWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY29sbGVjdGVkRW50ZXJFbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBlbG0gPSB0aGlzLmNvbGxlY3RlZEVudGVyRWxlbWVudHNbaV07XG4gICAgICAgIGFkZENsYXNzKGVsbSwgU1RBUl9DTEFTU05BTUUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9uYW1lc3BhY2VMaXN0Lmxlbmd0aCAmJlxuICAgICAgICAodGhpcy50b3RhbFF1ZXVlZFBsYXllcnMgfHwgdGhpcy5jb2xsZWN0ZWRMZWF2ZUVsZW1lbnRzLmxlbmd0aCkpIHtcbiAgICAgIGNvbnN0IGNsZWFudXBGbnM6IEZ1bmN0aW9uW10gPSBbXTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHBsYXllcnMgPSB0aGlzLl9mbHVzaEFuaW1hdGlvbnMoY2xlYW51cEZucywgbWljcm90YXNrSWQpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjbGVhbnVwRm5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY2xlYW51cEZuc1tpXSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jb2xsZWN0ZWRMZWF2ZUVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmNvbGxlY3RlZExlYXZlRWxlbWVudHNbaV07XG4gICAgICAgIHRoaXMucHJvY2Vzc0xlYXZlTm9kZShlbGVtZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnRvdGFsUXVldWVkUGxheWVycyA9IDA7XG4gICAgdGhpcy5jb2xsZWN0ZWRFbnRlckVsZW1lbnRzLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5jb2xsZWN0ZWRMZWF2ZUVsZW1lbnRzLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5fZmx1c2hGbnMuZm9yRWFjaChmbiA9PiBmbigpKTtcbiAgICB0aGlzLl9mbHVzaEZucyA9IFtdO1xuXG4gICAgaWYgKHRoaXMuX3doZW5RdWlldEZucy5sZW5ndGgpIHtcbiAgICAgIC8vIHdlIG1vdmUgdGhlc2Ugb3ZlciB0byBhIHZhcmlhYmxlIHNvIHRoYXRcbiAgICAgIC8vIGlmIGFueSBuZXcgY2FsbGJhY2tzIGFyZSByZWdpc3RlcmVkIGluIGFub3RoZXJcbiAgICAgIC8vIGZsdXNoIHRoZXkgZG8gbm90IHBvcHVsYXRlIHRoZSBleGlzdGluZyBzZXRcbiAgICAgIGNvbnN0IHF1aWV0Rm5zID0gdGhpcy5fd2hlblF1aWV0Rm5zO1xuICAgICAgdGhpcy5fd2hlblF1aWV0Rm5zID0gW107XG5cbiAgICAgIGlmIChwbGF5ZXJzLmxlbmd0aCkge1xuICAgICAgICBvcHRpbWl6ZUdyb3VwUGxheWVyKHBsYXllcnMpLm9uRG9uZSgoKSA9PiB7IHF1aWV0Rm5zLmZvckVhY2goZm4gPT4gZm4oKSk7IH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcXVpZXRGbnMuZm9yRWFjaChmbiA9PiBmbigpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXBvcnRFcnJvcihlcnJvcnM6IHN0cmluZ1tdKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgVW5hYmxlIHRvIHByb2Nlc3MgYW5pbWF0aW9ucyBkdWUgdG8gdGhlIGZvbGxvd2luZyBmYWlsZWQgdHJpZ2dlciB0cmFuc2l0aW9uc1xcbiAke1xuICAgICAgICAgICAgZXJyb3JzLmpvaW4oJ1xcbicpfWApO1xuICB9XG5cbiAgcHJpdmF0ZSBfZmx1c2hBbmltYXRpb25zKGNsZWFudXBGbnM6IEZ1bmN0aW9uW10sIG1pY3JvdGFza0lkOiBudW1iZXIpOlxuICAgICAgVHJhbnNpdGlvbkFuaW1hdGlvblBsYXllcltdIHtcbiAgICBjb25zdCBzdWJUaW1lbGluZXMgPSBuZXcgRWxlbWVudEluc3RydWN0aW9uTWFwKCk7XG4gICAgY29uc3Qgc2tpcHBlZFBsYXllcnM6IFRyYW5zaXRpb25BbmltYXRpb25QbGF5ZXJbXSA9IFtdO1xuICAgIGNvbnN0IHNraXBwZWRQbGF5ZXJzTWFwID0gbmV3IE1hcDxhbnksIEFuaW1hdGlvblBsYXllcltdPigpO1xuICAgIGNvbnN0IHF1ZXVlZEluc3RydWN0aW9uczogUXVldWVkVHJhbnNpdGlvbltdID0gW107XG4gICAgY29uc3QgcXVlcmllZEVsZW1lbnRzID0gbmV3IE1hcDxhbnksIFRyYW5zaXRpb25BbmltYXRpb25QbGF5ZXJbXT4oKTtcbiAgICBjb25zdCBhbGxQcmVTdHlsZUVsZW1lbnRzID0gbmV3IE1hcDxhbnksIFNldDxzdHJpbmc+PigpO1xuICAgIGNvbnN0IGFsbFBvc3RTdHlsZUVsZW1lbnRzID0gbmV3IE1hcDxhbnksIFNldDxzdHJpbmc+PigpO1xuXG4gICAgY29uc3QgZGlzYWJsZWRFbGVtZW50c1NldCA9IG5ldyBTZXQ8YW55PigpO1xuICAgIHRoaXMuZGlzYWJsZWROb2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgZGlzYWJsZWRFbGVtZW50c1NldC5hZGQobm9kZSk7XG4gICAgICBjb25zdCBub2Rlc1RoYXRBcmVEaXNhYmxlZCA9IHRoaXMuZHJpdmVyLnF1ZXJ5KG5vZGUsIFFVRVVFRF9TRUxFQ1RPUiwgdHJ1ZSk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzVGhhdEFyZURpc2FibGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGRpc2FibGVkRWxlbWVudHNTZXQuYWRkKG5vZGVzVGhhdEFyZURpc2FibGVkW2ldKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IGJvZHlOb2RlID0gdGhpcy5ib2R5Tm9kZTtcbiAgICBjb25zdCBhbGxUcmlnZ2VyRWxlbWVudHMgPSBBcnJheS5mcm9tKHRoaXMuc3RhdGVzQnlFbGVtZW50LmtleXMoKSk7XG4gICAgY29uc3QgZW50ZXJOb2RlTWFwID0gYnVpbGRSb290TWFwKGFsbFRyaWdnZXJFbGVtZW50cywgdGhpcy5jb2xsZWN0ZWRFbnRlckVsZW1lbnRzKTtcblxuICAgIC8vIHRoaXMgbXVzdCBvY2N1ciBiZWZvcmUgdGhlIGluc3RydWN0aW9ucyBhcmUgYnVpbHQgYmVsb3cgc3VjaCB0aGF0XG4gICAgLy8gdGhlIDplbnRlciBxdWVyaWVzIG1hdGNoIHRoZSBlbGVtZW50cyAoc2luY2UgdGhlIHRpbWVsaW5lIHF1ZXJpZXNcbiAgICAvLyBhcmUgZmlyZWQgZHVyaW5nIGluc3RydWN0aW9uIGJ1aWxkaW5nKS5cbiAgICBjb25zdCBlbnRlck5vZGVNYXBJZHMgPSBuZXcgTWFwPGFueSwgc3RyaW5nPigpO1xuICAgIGxldCBpID0gMDtcbiAgICBlbnRlck5vZGVNYXAuZm9yRWFjaCgobm9kZXMsIHJvb3QpID0+IHtcbiAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IEVOVEVSX0NMQVNTTkFNRSArIGkrKztcbiAgICAgIGVudGVyTm9kZU1hcElkcy5zZXQocm9vdCwgY2xhc3NOYW1lKTtcbiAgICAgIG5vZGVzLmZvckVhY2gobm9kZSA9PiBhZGRDbGFzcyhub2RlLCBjbGFzc05hbWUpKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGFsbExlYXZlTm9kZXM6IGFueVtdID0gW107XG4gICAgY29uc3QgbWVyZ2VkTGVhdmVOb2RlcyA9IG5ldyBTZXQ8YW55PigpO1xuICAgIGNvbnN0IGxlYXZlTm9kZXNXaXRob3V0QW5pbWF0aW9ucyA9IG5ldyBTZXQ8YW55PigpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jb2xsZWN0ZWRMZWF2ZUVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5jb2xsZWN0ZWRMZWF2ZUVsZW1lbnRzW2ldO1xuICAgICAgY29uc3QgZGV0YWlscyA9IGVsZW1lbnRbUkVNT1ZBTF9GTEFHXSBhcyBFbGVtZW50QW5pbWF0aW9uU3RhdGU7XG4gICAgICBpZiAoZGV0YWlscyAmJiBkZXRhaWxzLnNldEZvclJlbW92YWwpIHtcbiAgICAgICAgYWxsTGVhdmVOb2Rlcy5wdXNoKGVsZW1lbnQpO1xuICAgICAgICBtZXJnZWRMZWF2ZU5vZGVzLmFkZChlbGVtZW50KTtcbiAgICAgICAgaWYgKGRldGFpbHMuaGFzQW5pbWF0aW9uKSB7XG4gICAgICAgICAgdGhpcy5kcml2ZXIucXVlcnkoZWxlbWVudCwgU1RBUl9TRUxFQ1RPUiwgdHJ1ZSkuZm9yRWFjaChlbG0gPT4gbWVyZ2VkTGVhdmVOb2Rlcy5hZGQoZWxtKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGVhdmVOb2Rlc1dpdGhvdXRBbmltYXRpb25zLmFkZChlbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGxlYXZlTm9kZU1hcElkcyA9IG5ldyBNYXA8YW55LCBzdHJpbmc+KCk7XG4gICAgY29uc3QgbGVhdmVOb2RlTWFwID0gYnVpbGRSb290TWFwKGFsbFRyaWdnZXJFbGVtZW50cywgQXJyYXkuZnJvbShtZXJnZWRMZWF2ZU5vZGVzKSk7XG4gICAgbGVhdmVOb2RlTWFwLmZvckVhY2goKG5vZGVzLCByb290KSA9PiB7XG4gICAgICBjb25zdCBjbGFzc05hbWUgPSBMRUFWRV9DTEFTU05BTUUgKyBpKys7XG4gICAgICBsZWF2ZU5vZGVNYXBJZHMuc2V0KHJvb3QsIGNsYXNzTmFtZSk7XG4gICAgICBub2Rlcy5mb3JFYWNoKG5vZGUgPT4gYWRkQ2xhc3Mobm9kZSwgY2xhc3NOYW1lKSk7XG4gICAgfSk7XG5cbiAgICBjbGVhbnVwRm5zLnB1c2goKCkgPT4ge1xuICAgICAgZW50ZXJOb2RlTWFwLmZvckVhY2goKG5vZGVzLCByb290KSA9PiB7XG4gICAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IGVudGVyTm9kZU1hcElkcy5nZXQocm9vdCkgITtcbiAgICAgICAgbm9kZXMuZm9yRWFjaChub2RlID0+IHJlbW92ZUNsYXNzKG5vZGUsIGNsYXNzTmFtZSkpO1xuICAgICAgfSk7XG5cbiAgICAgIGxlYXZlTm9kZU1hcC5mb3JFYWNoKChub2Rlcywgcm9vdCkgPT4ge1xuICAgICAgICBjb25zdCBjbGFzc05hbWUgPSBsZWF2ZU5vZGVNYXBJZHMuZ2V0KHJvb3QpICE7XG4gICAgICAgIG5vZGVzLmZvckVhY2gobm9kZSA9PiByZW1vdmVDbGFzcyhub2RlLCBjbGFzc05hbWUpKTtcbiAgICAgIH0pO1xuXG4gICAgICBhbGxMZWF2ZU5vZGVzLmZvckVhY2goZWxlbWVudCA9PiB7IHRoaXMucHJvY2Vzc0xlYXZlTm9kZShlbGVtZW50KTsgfSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBhbGxQbGF5ZXJzOiBUcmFuc2l0aW9uQW5pbWF0aW9uUGxheWVyW10gPSBbXTtcbiAgICBjb25zdCBlcnJvbmVvdXNUcmFuc2l0aW9uczogQW5pbWF0aW9uVHJhbnNpdGlvbkluc3RydWN0aW9uW10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gdGhpcy5fbmFtZXNwYWNlTGlzdC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgY29uc3QgbnMgPSB0aGlzLl9uYW1lc3BhY2VMaXN0W2ldO1xuICAgICAgbnMuZHJhaW5RdWV1ZWRUcmFuc2l0aW9ucyhtaWNyb3Rhc2tJZCkuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICAgIGNvbnN0IHBsYXllciA9IGVudHJ5LnBsYXllcjtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGVudHJ5LmVsZW1lbnQ7XG4gICAgICAgIGFsbFBsYXllcnMucHVzaChwbGF5ZXIpO1xuXG4gICAgICAgIGlmICh0aGlzLmNvbGxlY3RlZEVudGVyRWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgZGV0YWlscyA9IGVsZW1lbnRbUkVNT1ZBTF9GTEFHXSBhcyBFbGVtZW50QW5pbWF0aW9uU3RhdGU7XG4gICAgICAgICAgLy8gbW92ZSBhbmltYXRpb25zIGFyZSBjdXJyZW50bHkgbm90IHN1cHBvcnRlZC4uLlxuICAgICAgICAgIGlmIChkZXRhaWxzICYmIGRldGFpbHMuc2V0Rm9yTW92ZSkge1xuICAgICAgICAgICAgcGxheWVyLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBub2RlSXNPcnBoYW5lZCA9ICFib2R5Tm9kZSB8fCAhdGhpcy5kcml2ZXIuY29udGFpbnNFbGVtZW50KGJvZHlOb2RlLCBlbGVtZW50KTtcbiAgICAgICAgY29uc3QgbGVhdmVDbGFzc05hbWUgPSBsZWF2ZU5vZGVNYXBJZHMuZ2V0KGVsZW1lbnQpICE7XG4gICAgICAgIGNvbnN0IGVudGVyQ2xhc3NOYW1lID0gZW50ZXJOb2RlTWFwSWRzLmdldChlbGVtZW50KSAhO1xuICAgICAgICBjb25zdCBpbnN0cnVjdGlvbiA9IHRoaXMuX2J1aWxkSW5zdHJ1Y3Rpb24oXG4gICAgICAgICAgICBlbnRyeSwgc3ViVGltZWxpbmVzLCBlbnRlckNsYXNzTmFtZSwgbGVhdmVDbGFzc05hbWUsIG5vZGVJc09ycGhhbmVkKSAhO1xuICAgICAgICBpZiAoaW5zdHJ1Y3Rpb24uZXJyb3JzICYmIGluc3RydWN0aW9uLmVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgICBlcnJvbmVvdXNUcmFuc2l0aW9ucy5wdXNoKGluc3RydWN0aW9uKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBldmVuIHRob3VnaCB0aGUgZWxlbWVudCBtYXkgbm90IGJlIGFwYXJ0IG9mIHRoZSBET00sIGl0IG1heVxuICAgICAgICAvLyBzdGlsbCBiZSBhZGRlZCBhdCBhIGxhdGVyIHBvaW50IChkdWUgdG8gdGhlIG1lY2hhbmljcyBvZiBjb250ZW50XG4gICAgICAgIC8vIHByb2plY3Rpb24gYW5kL29yIGR5bmFtaWMgY29tcG9uZW50IGluc2VydGlvbikgdGhlcmVmb3JlIGl0J3NcbiAgICAgICAgLy8gaW1wb3J0YW50IHdlIHN0aWxsIHN0eWxlIHRoZSBlbGVtZW50LlxuICAgICAgICBpZiAobm9kZUlzT3JwaGFuZWQpIHtcbiAgICAgICAgICBwbGF5ZXIub25TdGFydCgoKSA9PiBlcmFzZVN0eWxlcyhlbGVtZW50LCBpbnN0cnVjdGlvbi5mcm9tU3R5bGVzKSk7XG4gICAgICAgICAgcGxheWVyLm9uRGVzdHJveSgoKSA9PiBzZXRTdHlsZXMoZWxlbWVudCwgaW5zdHJ1Y3Rpb24udG9TdHlsZXMpKTtcbiAgICAgICAgICBza2lwcGVkUGxheWVycy5wdXNoKHBsYXllcik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgYSB1bm1hdGNoZWQgdHJhbnNpdGlvbiBpcyBxdWV1ZWQgdG8gZ28gdGhlbiBpdCBTSE9VTEQgTk9UIHJlbmRlclxuICAgICAgICAvLyBhbiBhbmltYXRpb24gYW5kIGNhbmNlbCB0aGUgcHJldmlvdXNseSBydW5uaW5nIGFuaW1hdGlvbnMuXG4gICAgICAgIGlmIChlbnRyeS5pc0ZhbGxiYWNrVHJhbnNpdGlvbikge1xuICAgICAgICAgIHBsYXllci5vblN0YXJ0KCgpID0+IGVyYXNlU3R5bGVzKGVsZW1lbnQsIGluc3RydWN0aW9uLmZyb21TdHlsZXMpKTtcbiAgICAgICAgICBwbGF5ZXIub25EZXN0cm95KCgpID0+IHNldFN0eWxlcyhlbGVtZW50LCBpbnN0cnVjdGlvbi50b1N0eWxlcykpO1xuICAgICAgICAgIHNraXBwZWRQbGF5ZXJzLnB1c2gocGxheWVyKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0aGlzIG1lYW5zIHRoYXQgaWYgYSBwYXJlbnQgYW5pbWF0aW9uIHVzZXMgdGhpcyBhbmltYXRpb24gYXMgYSBzdWIgdHJpZ2dlclxuICAgICAgICAvLyB0aGVuIGl0IHdpbGwgaW5zdHJ1Y3QgdGhlIHRpbWVsaW5lIGJ1aWxkZXIgdG8gbm90IGFkZCBhIHBsYXllciBkZWxheSwgYnV0XG4gICAgICAgIC8vIGluc3RlYWQgc3RyZXRjaCB0aGUgZmlyc3Qga2V5ZnJhbWUgZ2FwIHVwIHVudGlsIHRoZSBhbmltYXRpb24gc3RhcnRzLiBUaGVcbiAgICAgICAgLy8gcmVhc29uIHRoaXMgaXMgaW1wb3J0YW50IGlzIHRvIHByZXZlbnQgZXh0cmEgaW5pdGlhbGl6YXRpb24gc3R5bGVzIGZyb20gYmVpbmdcbiAgICAgICAgLy8gcmVxdWlyZWQgYnkgdGhlIHVzZXIgaW4gdGhlIGFuaW1hdGlvbi5cbiAgICAgICAgaW5zdHJ1Y3Rpb24udGltZWxpbmVzLmZvckVhY2godGwgPT4gdGwuc3RyZXRjaFN0YXJ0aW5nS2V5ZnJhbWUgPSB0cnVlKTtcblxuICAgICAgICBzdWJUaW1lbGluZXMuYXBwZW5kKGVsZW1lbnQsIGluc3RydWN0aW9uLnRpbWVsaW5lcyk7XG5cbiAgICAgICAgY29uc3QgdHVwbGUgPSB7aW5zdHJ1Y3Rpb24sIHBsYXllciwgZWxlbWVudH07XG5cbiAgICAgICAgcXVldWVkSW5zdHJ1Y3Rpb25zLnB1c2godHVwbGUpO1xuXG4gICAgICAgIGluc3RydWN0aW9uLnF1ZXJpZWRFbGVtZW50cy5mb3JFYWNoKFxuICAgICAgICAgICAgZWxlbWVudCA9PiBnZXRPclNldEFzSW5NYXAocXVlcmllZEVsZW1lbnRzLCBlbGVtZW50LCBbXSkucHVzaChwbGF5ZXIpKTtcblxuICAgICAgICBpbnN0cnVjdGlvbi5wcmVTdHlsZVByb3BzLmZvckVhY2goKHN0cmluZ01hcCwgZWxlbWVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHByb3BzID0gT2JqZWN0LmtleXMoc3RyaW5nTWFwKTtcbiAgICAgICAgICBpZiAocHJvcHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBsZXQgc2V0VmFsOiBTZXQ8c3RyaW5nPiA9IGFsbFByZVN0eWxlRWxlbWVudHMuZ2V0KGVsZW1lbnQpICE7XG4gICAgICAgICAgICBpZiAoIXNldFZhbCkge1xuICAgICAgICAgICAgICBhbGxQcmVTdHlsZUVsZW1lbnRzLnNldChlbGVtZW50LCBzZXRWYWwgPSBuZXcgU2V0PHN0cmluZz4oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcm9wcy5mb3JFYWNoKHByb3AgPT4gc2V0VmFsLmFkZChwcm9wKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpbnN0cnVjdGlvbi5wb3N0U3R5bGVQcm9wcy5mb3JFYWNoKChzdHJpbmdNYXAsIGVsZW1lbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBwcm9wcyA9IE9iamVjdC5rZXlzKHN0cmluZ01hcCk7XG4gICAgICAgICAgbGV0IHNldFZhbDogU2V0PHN0cmluZz4gPSBhbGxQb3N0U3R5bGVFbGVtZW50cy5nZXQoZWxlbWVudCkgITtcbiAgICAgICAgICBpZiAoIXNldFZhbCkge1xuICAgICAgICAgICAgYWxsUG9zdFN0eWxlRWxlbWVudHMuc2V0KGVsZW1lbnQsIHNldFZhbCA9IG5ldyBTZXQ8c3RyaW5nPigpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcHJvcHMuZm9yRWFjaChwcm9wID0+IHNldFZhbC5hZGQocHJvcCkpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChlcnJvbmVvdXNUcmFuc2l0aW9ucy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGVycm9yczogc3RyaW5nW10gPSBbXTtcbiAgICAgIGVycm9uZW91c1RyYW5zaXRpb25zLmZvckVhY2goaW5zdHJ1Y3Rpb24gPT4ge1xuICAgICAgICBlcnJvcnMucHVzaChgQCR7aW5zdHJ1Y3Rpb24udHJpZ2dlck5hbWV9IGhhcyBmYWlsZWQgZHVlIHRvOlxcbmApO1xuICAgICAgICBpbnN0cnVjdGlvbi5lcnJvcnMgIS5mb3JFYWNoKGVycm9yID0+IGVycm9ycy5wdXNoKGAtICR7ZXJyb3J9XFxuYCkpO1xuICAgICAgfSk7XG5cbiAgICAgIGFsbFBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4gcGxheWVyLmRlc3Ryb3koKSk7XG4gICAgICB0aGlzLnJlcG9ydEVycm9yKGVycm9ycyk7XG4gICAgfVxuXG4gICAgY29uc3QgYWxsUHJldmlvdXNQbGF5ZXJzTWFwID0gbmV3IE1hcDxhbnksIFRyYW5zaXRpb25BbmltYXRpb25QbGF5ZXJbXT4oKTtcbiAgICAvLyB0aGlzIG1hcCB3b3JrcyB0byB0ZWxsIHdoaWNoIGVsZW1lbnQgaW4gdGhlIERPTSB0cmVlIGlzIGNvbnRhaW5lZCBieVxuICAgIC8vIHdoaWNoIGFuaW1hdGlvbi4gRnVydGhlciBkb3duIGJlbG93IHRoaXMgbWFwIHdpbGwgZ2V0IHBvcHVsYXRlZCBvbmNlXG4gICAgLy8gdGhlIHBsYXllcnMgYXJlIGJ1aWx0IGFuZCBpbiBkb2luZyBzbyBpdCBjYW4gZWZmaWNpZW50bHkgZmlndXJlIG91dFxuICAgIC8vIGlmIGEgc3ViIHBsYXllciBpcyBza2lwcGVkIGR1ZSB0byBhIHBhcmVudCBwbGF5ZXIgaGF2aW5nIHByaW9yaXR5LlxuICAgIGNvbnN0IGFuaW1hdGlvbkVsZW1lbnRNYXAgPSBuZXcgTWFwPGFueSwgYW55PigpO1xuICAgIHF1ZXVlZEluc3RydWN0aW9ucy5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBlbnRyeS5lbGVtZW50O1xuICAgICAgaWYgKHN1YlRpbWVsaW5lcy5oYXMoZWxlbWVudCkpIHtcbiAgICAgICAgYW5pbWF0aW9uRWxlbWVudE1hcC5zZXQoZWxlbWVudCwgZWxlbWVudCk7XG4gICAgICAgIHRoaXMuX2JlZm9yZUFuaW1hdGlvbkJ1aWxkKFxuICAgICAgICAgICAgZW50cnkucGxheWVyLm5hbWVzcGFjZUlkLCBlbnRyeS5pbnN0cnVjdGlvbiwgYWxsUHJldmlvdXNQbGF5ZXJzTWFwKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHNraXBwZWRQbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBwbGF5ZXIuZWxlbWVudDtcbiAgICAgIGNvbnN0IHByZXZpb3VzUGxheWVycyA9XG4gICAgICAgICAgdGhpcy5fZ2V0UHJldmlvdXNQbGF5ZXJzKGVsZW1lbnQsIGZhbHNlLCBwbGF5ZXIubmFtZXNwYWNlSWQsIHBsYXllci50cmlnZ2VyTmFtZSwgbnVsbCk7XG4gICAgICBwcmV2aW91c1BsYXllcnMuZm9yRWFjaChwcmV2UGxheWVyID0+IHtcbiAgICAgICAgZ2V0T3JTZXRBc0luTWFwKGFsbFByZXZpb3VzUGxheWVyc01hcCwgZWxlbWVudCwgW10pLnB1c2gocHJldlBsYXllcik7XG4gICAgICAgIHByZXZQbGF5ZXIuZGVzdHJveSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyB0aGlzIGlzIGEgc3BlY2lhbCBjYXNlIGZvciBub2RlcyB0aGF0IHdpbGwgYmUgcmVtb3ZlZCAoZWl0aGVyIGJ5KVxuICAgIC8vIGhhdmluZyB0aGVpciBvd24gbGVhdmUgYW5pbWF0aW9ucyBvciBieSBiZWluZyBxdWVyaWVkIGluIGEgY29udGFpbmVyXG4gICAgLy8gdGhhdCB3aWxsIGJlIHJlbW92ZWQgb25jZSBhIHBhcmVudCBhbmltYXRpb24gaXMgY29tcGxldGUuIFRoZSBpZGVhXG4gICAgLy8gaGVyZSBpcyB0aGF0ICogc3R5bGVzIG11c3QgYmUgaWRlbnRpY2FsIHRvICEgc3R5bGVzIGJlY2F1c2Ugb2ZcbiAgICAvLyBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSAoKiBpcyBhbHNvIGZpbGxlZCBpbiBieSBkZWZhdWx0IGluIG1hbnkgcGxhY2VzKS5cbiAgICAvLyBPdGhlcndpc2UgKiBzdHlsZXMgd2lsbCByZXR1cm4gYW4gZW1wdHkgdmFsdWUgb3IgYXV0byBzaW5jZSB0aGUgZWxlbWVudFxuICAgIC8vIHRoYXQgaXMgYmVpbmcgZ2V0Q29tcHV0ZWRTdHlsZSdkIHdpbGwgbm90IGJlIHZpc2libGUgKHNpbmNlICogPSBkZXN0aW5hdGlvbilcbiAgICBjb25zdCByZXBsYWNlTm9kZXMgPSBhbGxMZWF2ZU5vZGVzLmZpbHRlcihub2RlID0+IHtcbiAgICAgIHJldHVybiByZXBsYWNlUG9zdFN0eWxlc0FzUHJlKG5vZGUsIGFsbFByZVN0eWxlRWxlbWVudHMsIGFsbFBvc3RTdHlsZUVsZW1lbnRzKTtcbiAgICB9KTtcblxuICAgIC8vIFBPU1QgU1RBR0U6IGZpbGwgdGhlICogc3R5bGVzXG4gICAgY29uc3QgcG9zdFN0eWxlc01hcCA9IG5ldyBNYXA8YW55LCDJtVN0eWxlRGF0YT4oKTtcbiAgICBjb25zdCBhbGxMZWF2ZVF1ZXJpZWROb2RlcyA9IGNsb2FrQW5kQ29tcHV0ZVN0eWxlcyhcbiAgICAgICAgcG9zdFN0eWxlc01hcCwgdGhpcy5kcml2ZXIsIGxlYXZlTm9kZXNXaXRob3V0QW5pbWF0aW9ucywgYWxsUG9zdFN0eWxlRWxlbWVudHMsIEFVVE9fU1RZTEUpO1xuXG4gICAgYWxsTGVhdmVRdWVyaWVkTm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgIGlmIChyZXBsYWNlUG9zdFN0eWxlc0FzUHJlKG5vZGUsIGFsbFByZVN0eWxlRWxlbWVudHMsIGFsbFBvc3RTdHlsZUVsZW1lbnRzKSkge1xuICAgICAgICByZXBsYWNlTm9kZXMucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFBSRSBTVEFHRTogZmlsbCB0aGUgISBzdHlsZXNcbiAgICBjb25zdCBwcmVTdHlsZXNNYXAgPSBuZXcgTWFwPGFueSwgybVTdHlsZURhdGE+KCk7XG4gICAgZW50ZXJOb2RlTWFwLmZvckVhY2goKG5vZGVzLCByb290KSA9PiB7XG4gICAgICBjbG9ha0FuZENvbXB1dGVTdHlsZXMoXG4gICAgICAgICAgcHJlU3R5bGVzTWFwLCB0aGlzLmRyaXZlciwgbmV3IFNldChub2RlcyksIGFsbFByZVN0eWxlRWxlbWVudHMsIFBSRV9TVFlMRSk7XG4gICAgfSk7XG5cbiAgICByZXBsYWNlTm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgIGNvbnN0IHBvc3QgPSBwb3N0U3R5bGVzTWFwLmdldChub2RlKTtcbiAgICAgIGNvbnN0IHByZSA9IHByZVN0eWxlc01hcC5nZXQobm9kZSk7XG4gICAgICBwb3N0U3R5bGVzTWFwLnNldChub2RlLCB7IC4uLnBvc3QsIC4uLnByZSB9IGFzIGFueSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCByb290UGxheWVyczogVHJhbnNpdGlvbkFuaW1hdGlvblBsYXllcltdID0gW107XG4gICAgY29uc3Qgc3ViUGxheWVyczogVHJhbnNpdGlvbkFuaW1hdGlvblBsYXllcltdID0gW107XG4gICAgY29uc3QgTk9fUEFSRU5UX0FOSU1BVElPTl9FTEVNRU5UX0RFVEVDVEVEID0ge307XG4gICAgcXVldWVkSW5zdHJ1Y3Rpb25zLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgY29uc3Qge2VsZW1lbnQsIHBsYXllciwgaW5zdHJ1Y3Rpb259ID0gZW50cnk7XG4gICAgICAvLyB0aGlzIG1lYW5zIHRoYXQgaXQgd2FzIG5ldmVyIGNvbnN1bWVkIGJ5IGEgcGFyZW50IGFuaW1hdGlvbiB3aGljaFxuICAgICAgLy8gbWVhbnMgdGhhdCBpdCBpcyBpbmRlcGVuZGVudCBhbmQgdGhlcmVmb3JlIHNob3VsZCBiZSBzZXQgZm9yIGFuaW1hdGlvblxuICAgICAgaWYgKHN1YlRpbWVsaW5lcy5oYXMoZWxlbWVudCkpIHtcbiAgICAgICAgaWYgKGRpc2FibGVkRWxlbWVudHNTZXQuaGFzKGVsZW1lbnQpKSB7XG4gICAgICAgICAgcGxheWVyLm9uRGVzdHJveSgoKSA9PiBzZXRTdHlsZXMoZWxlbWVudCwgaW5zdHJ1Y3Rpb24udG9TdHlsZXMpKTtcbiAgICAgICAgICBwbGF5ZXIuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgIHBsYXllci5vdmVycmlkZVRvdGFsVGltZShpbnN0cnVjdGlvbi50b3RhbFRpbWUpO1xuICAgICAgICAgIHNraXBwZWRQbGF5ZXJzLnB1c2gocGxheWVyKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0aGlzIHdpbGwgZmxvdyB1cCB0aGUgRE9NIGFuZCBxdWVyeSB0aGUgbWFwIHRvIGZpZ3VyZSBvdXRcbiAgICAgICAgLy8gaWYgYSBwYXJlbnQgYW5pbWF0aW9uIGhhcyBwcmlvcml0eSBvdmVyIGl0LiBJbiB0aGUgc2l0dWF0aW9uXG4gICAgICAgIC8vIHRoYXQgYSBwYXJlbnQgaXMgZGV0ZWN0ZWQgdGhlbiBpdCB3aWxsIGNhbmNlbCB0aGUgbG9vcC4gSWZcbiAgICAgICAgLy8gbm90aGluZyBpcyBkZXRlY3RlZCwgb3IgaXQgdGFrZXMgYSBmZXcgaG9wcyB0byBmaW5kIGEgcGFyZW50LFxuICAgICAgICAvLyB0aGVuIGl0IHdpbGwgZmlsbCBpbiB0aGUgbWlzc2luZyBub2RlcyBhbmQgc2lnbmFsIHRoZW0gYXMgaGF2aW5nXG4gICAgICAgIC8vIGEgZGV0ZWN0ZWQgcGFyZW50IChvciBhIE5PX1BBUkVOVCB2YWx1ZSB2aWEgYSBzcGVjaWFsIGNvbnN0YW50KS5cbiAgICAgICAgbGV0IHBhcmVudFdpdGhBbmltYXRpb246IGFueSA9IE5PX1BBUkVOVF9BTklNQVRJT05fRUxFTUVOVF9ERVRFQ1RFRDtcbiAgICAgICAgaWYgKGFuaW1hdGlvbkVsZW1lbnRNYXAuc2l6ZSA+IDEpIHtcbiAgICAgICAgICBsZXQgZWxtID0gZWxlbWVudDtcbiAgICAgICAgICBjb25zdCBwYXJlbnRzVG9BZGQ6IGFueVtdID0gW107XG4gICAgICAgICAgd2hpbGUgKGVsbSA9IGVsbS5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICBjb25zdCBkZXRlY3RlZFBhcmVudCA9IGFuaW1hdGlvbkVsZW1lbnRNYXAuZ2V0KGVsbSk7XG4gICAgICAgICAgICBpZiAoZGV0ZWN0ZWRQYXJlbnQpIHtcbiAgICAgICAgICAgICAgcGFyZW50V2l0aEFuaW1hdGlvbiA9IGRldGVjdGVkUGFyZW50O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcmVudHNUb0FkZC5wdXNoKGVsbSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHBhcmVudHNUb0FkZC5mb3JFYWNoKHBhcmVudCA9PiBhbmltYXRpb25FbGVtZW50TWFwLnNldChwYXJlbnQsIHBhcmVudFdpdGhBbmltYXRpb24pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGlubmVyUGxheWVyID0gdGhpcy5fYnVpbGRBbmltYXRpb24oXG4gICAgICAgICAgICBwbGF5ZXIubmFtZXNwYWNlSWQsIGluc3RydWN0aW9uLCBhbGxQcmV2aW91c1BsYXllcnNNYXAsIHNraXBwZWRQbGF5ZXJzTWFwLCBwcmVTdHlsZXNNYXAsXG4gICAgICAgICAgICBwb3N0U3R5bGVzTWFwKTtcblxuICAgICAgICBwbGF5ZXIuc2V0UmVhbFBsYXllcihpbm5lclBsYXllcik7XG5cbiAgICAgICAgaWYgKHBhcmVudFdpdGhBbmltYXRpb24gPT09IE5PX1BBUkVOVF9BTklNQVRJT05fRUxFTUVOVF9ERVRFQ1RFRCkge1xuICAgICAgICAgIHJvb3RQbGF5ZXJzLnB1c2gocGxheWVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBwYXJlbnRQbGF5ZXJzID0gdGhpcy5wbGF5ZXJzQnlFbGVtZW50LmdldChwYXJlbnRXaXRoQW5pbWF0aW9uKTtcbiAgICAgICAgICBpZiAocGFyZW50UGxheWVycyAmJiBwYXJlbnRQbGF5ZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgcGxheWVyLnBhcmVudFBsYXllciA9IG9wdGltaXplR3JvdXBQbGF5ZXIocGFyZW50UGxheWVycyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHNraXBwZWRQbGF5ZXJzLnB1c2gocGxheWVyKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXJhc2VTdHlsZXMoZWxlbWVudCwgaW5zdHJ1Y3Rpb24uZnJvbVN0eWxlcyk7XG4gICAgICAgIHBsYXllci5vbkRlc3Ryb3koKCkgPT4gc2V0U3R5bGVzKGVsZW1lbnQsIGluc3RydWN0aW9uLnRvU3R5bGVzKSk7XG4gICAgICAgIC8vIHRoZXJlIHN0aWxsIG1pZ2h0IGJlIGEgYW5jZXN0b3IgcGxheWVyIGFuaW1hdGluZyB0aGlzXG4gICAgICAgIC8vIGVsZW1lbnQgdGhlcmVmb3JlIHdlIHdpbGwgc3RpbGwgYWRkIGl0IGFzIGEgc3ViIHBsYXllclxuICAgICAgICAvLyBldmVuIGlmIGl0cyBhbmltYXRpb24gbWF5IGJlIGRpc2FibGVkXG4gICAgICAgIHN1YlBsYXllcnMucHVzaChwbGF5ZXIpO1xuICAgICAgICBpZiAoZGlzYWJsZWRFbGVtZW50c1NldC5oYXMoZWxlbWVudCkpIHtcbiAgICAgICAgICBza2lwcGVkUGxheWVycy5wdXNoKHBsYXllcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIGZpbmQgYWxsIG9mIHRoZSBzdWIgcGxheWVycycgY29ycmVzcG9uZGluZyBpbm5lciBhbmltYXRpb24gcGxheWVyXG4gICAgc3ViUGxheWVycy5mb3JFYWNoKHBsYXllciA9PiB7XG4gICAgICAvLyBldmVuIGlmIGFueSBwbGF5ZXJzIGFyZSBub3QgZm91bmQgZm9yIGEgc3ViIGFuaW1hdGlvbiB0aGVuIGl0XG4gICAgICAvLyB3aWxsIHN0aWxsIGNvbXBsZXRlIGl0c2VsZiBhZnRlciB0aGUgbmV4dCB0aWNrIHNpbmNlIGl0J3MgTm9vcFxuICAgICAgY29uc3QgcGxheWVyc0ZvckVsZW1lbnQgPSBza2lwcGVkUGxheWVyc01hcC5nZXQocGxheWVyLmVsZW1lbnQpO1xuICAgICAgaWYgKHBsYXllcnNGb3JFbGVtZW50ICYmIHBsYXllcnNGb3JFbGVtZW50Lmxlbmd0aCkge1xuICAgICAgICBjb25zdCBpbm5lclBsYXllciA9IG9wdGltaXplR3JvdXBQbGF5ZXIocGxheWVyc0ZvckVsZW1lbnQpO1xuICAgICAgICBwbGF5ZXIuc2V0UmVhbFBsYXllcihpbm5lclBsYXllcik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyB0aGUgcmVhc29uIHdoeSB3ZSBkb24ndCBhY3R1YWxseSBwbGF5IHRoZSBhbmltYXRpb24gaXNcbiAgICAvLyBiZWNhdXNlIGFsbCB0aGF0IGEgc2tpcHBlZCBwbGF5ZXIgaXMgZGVzaWduZWQgdG8gZG8gaXMgdG9cbiAgICAvLyBmaXJlIHRoZSBzdGFydC9kb25lIHRyYW5zaXRpb24gY2FsbGJhY2sgZXZlbnRzXG4gICAgc2tpcHBlZFBsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4ge1xuICAgICAgaWYgKHBsYXllci5wYXJlbnRQbGF5ZXIpIHtcbiAgICAgICAgcGxheWVyLnN5bmNQbGF5ZXJFdmVudHMocGxheWVyLnBhcmVudFBsYXllcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwbGF5ZXIuZGVzdHJveSgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gcnVuIHRocm91Z2ggYWxsIG9mIHRoZSBxdWV1ZWQgcmVtb3ZhbHMgYW5kIHNlZSBpZiB0aGV5XG4gICAgLy8gd2VyZSBwaWNrZWQgdXAgYnkgYSBxdWVyeS4gSWYgbm90IHRoZW4gcGVyZm9ybSB0aGUgcmVtb3ZhbFxuICAgIC8vIG9wZXJhdGlvbiByaWdodCBhd2F5IHVubGVzcyBhIHBhcmVudCBhbmltYXRpb24gaXMgb25nb2luZy5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFsbExlYXZlTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBhbGxMZWF2ZU5vZGVzW2ldO1xuICAgICAgY29uc3QgZGV0YWlscyA9IGVsZW1lbnRbUkVNT1ZBTF9GTEFHXSBhcyBFbGVtZW50QW5pbWF0aW9uU3RhdGU7XG4gICAgICByZW1vdmVDbGFzcyhlbGVtZW50LCBMRUFWRV9DTEFTU05BTUUpO1xuXG4gICAgICAvLyB0aGlzIG1lYW5zIHRoZSBlbGVtZW50IGhhcyBhIHJlbW92YWwgYW5pbWF0aW9uIHRoYXQgaXMgYmVpbmdcbiAgICAgIC8vIHRha2VuIGNhcmUgb2YgYW5kIHRoZXJlZm9yZSB0aGUgaW5uZXIgZWxlbWVudHMgd2lsbCBoYW5nIGFyb3VuZFxuICAgICAgLy8gdW50aWwgdGhhdCBhbmltYXRpb24gaXMgb3ZlciAob3IgdGhlIHBhcmVudCBxdWVyaWVkIGFuaW1hdGlvbilcbiAgICAgIGlmIChkZXRhaWxzICYmIGRldGFpbHMuaGFzQW5pbWF0aW9uKSBjb250aW51ZTtcblxuICAgICAgbGV0IHBsYXllcnM6IFRyYW5zaXRpb25BbmltYXRpb25QbGF5ZXJbXSA9IFtdO1xuXG4gICAgICAvLyBpZiB0aGlzIGVsZW1lbnQgaXMgcXVlcmllZCBvciBpZiBpdCBjb250YWlucyBxdWVyaWVkIGNoaWxkcmVuXG4gICAgICAvLyB0aGVuIHdlIHdhbnQgZm9yIHRoZSBlbGVtZW50IG5vdCB0byBiZSByZW1vdmVkIGZyb20gdGhlIHBhZ2VcbiAgICAgIC8vIHVudGlsIHRoZSBxdWVyaWVkIGFuaW1hdGlvbnMgaGF2ZSBmaW5pc2hlZFxuICAgICAgaWYgKHF1ZXJpZWRFbGVtZW50cy5zaXplKSB7XG4gICAgICAgIGxldCBxdWVyaWVkUGxheWVyUmVzdWx0cyA9IHF1ZXJpZWRFbGVtZW50cy5nZXQoZWxlbWVudCk7XG4gICAgICAgIGlmIChxdWVyaWVkUGxheWVyUmVzdWx0cyAmJiBxdWVyaWVkUGxheWVyUmVzdWx0cy5sZW5ndGgpIHtcbiAgICAgICAgICBwbGF5ZXJzLnB1c2goLi4ucXVlcmllZFBsYXllclJlc3VsdHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHF1ZXJpZWRJbm5lckVsZW1lbnRzID0gdGhpcy5kcml2ZXIucXVlcnkoZWxlbWVudCwgTkdfQU5JTUFUSU5HX1NFTEVDVE9SLCB0cnVlKTtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBxdWVyaWVkSW5uZXJFbGVtZW50cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGxldCBxdWVyaWVkUGxheWVycyA9IHF1ZXJpZWRFbGVtZW50cy5nZXQocXVlcmllZElubmVyRWxlbWVudHNbal0pO1xuICAgICAgICAgIGlmIChxdWVyaWVkUGxheWVycyAmJiBxdWVyaWVkUGxheWVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHBsYXllcnMucHVzaCguLi5xdWVyaWVkUGxheWVycyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGFjdGl2ZVBsYXllcnMgPSBwbGF5ZXJzLmZpbHRlcihwID0+ICFwLmRlc3Ryb3llZCk7XG4gICAgICBpZiAoYWN0aXZlUGxheWVycy5sZW5ndGgpIHtcbiAgICAgICAgcmVtb3ZlTm9kZXNBZnRlckFuaW1hdGlvbkRvbmUodGhpcywgZWxlbWVudCwgYWN0aXZlUGxheWVycyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnByb2Nlc3NMZWF2ZU5vZGUoZWxlbWVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdGhpcyBpcyByZXF1aXJlZCBzbyB0aGUgY2xlYW51cCBtZXRob2QgZG9lc24ndCByZW1vdmUgdGhlbVxuICAgIGFsbExlYXZlTm9kZXMubGVuZ3RoID0gMDtcblxuICAgIHJvb3RQbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcbiAgICAgIHRoaXMucGxheWVycy5wdXNoKHBsYXllcik7XG4gICAgICBwbGF5ZXIub25Eb25lKCgpID0+IHtcbiAgICAgICAgcGxheWVyLmRlc3Ryb3koKTtcblxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMucGxheWVycy5pbmRleE9mKHBsYXllcik7XG4gICAgICAgIHRoaXMucGxheWVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfSk7XG4gICAgICBwbGF5ZXIucGxheSgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJvb3RQbGF5ZXJzO1xuICB9XG5cbiAgZWxlbWVudENvbnRhaW5zRGF0YShuYW1lc3BhY2VJZDogc3RyaW5nLCBlbGVtZW50OiBhbnkpIHtcbiAgICBsZXQgY29udGFpbnNEYXRhID0gZmFsc2U7XG4gICAgY29uc3QgZGV0YWlscyA9IGVsZW1lbnRbUkVNT1ZBTF9GTEFHXSBhcyBFbGVtZW50QW5pbWF0aW9uU3RhdGU7XG4gICAgaWYgKGRldGFpbHMgJiYgZGV0YWlscy5zZXRGb3JSZW1vdmFsKSBjb250YWluc0RhdGEgPSB0cnVlO1xuICAgIGlmICh0aGlzLnBsYXllcnNCeUVsZW1lbnQuaGFzKGVsZW1lbnQpKSBjb250YWluc0RhdGEgPSB0cnVlO1xuICAgIGlmICh0aGlzLnBsYXllcnNCeVF1ZXJpZWRFbGVtZW50LmhhcyhlbGVtZW50KSkgY29udGFpbnNEYXRhID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5zdGF0ZXNCeUVsZW1lbnQuaGFzKGVsZW1lbnQpKSBjb250YWluc0RhdGEgPSB0cnVlO1xuICAgIHJldHVybiB0aGlzLl9mZXRjaE5hbWVzcGFjZShuYW1lc3BhY2VJZCkuZWxlbWVudENvbnRhaW5zRGF0YShlbGVtZW50KSB8fCBjb250YWluc0RhdGE7XG4gIH1cblxuICBhZnRlckZsdXNoKGNhbGxiYWNrOiAoKSA9PiBhbnkpIHsgdGhpcy5fZmx1c2hGbnMucHVzaChjYWxsYmFjayk7IH1cblxuICBhZnRlckZsdXNoQW5pbWF0aW9uc0RvbmUoY2FsbGJhY2s6ICgpID0+IGFueSkgeyB0aGlzLl93aGVuUXVpZXRGbnMucHVzaChjYWxsYmFjayk7IH1cblxuICBwcml2YXRlIF9nZXRQcmV2aW91c1BsYXllcnMoXG4gICAgICBlbGVtZW50OiBzdHJpbmcsIGlzUXVlcmllZEVsZW1lbnQ6IGJvb2xlYW4sIG5hbWVzcGFjZUlkPzogc3RyaW5nLCB0cmlnZ2VyTmFtZT86IHN0cmluZyxcbiAgICAgIHRvU3RhdGVWYWx1ZT86IGFueSk6IFRyYW5zaXRpb25BbmltYXRpb25QbGF5ZXJbXSB7XG4gICAgbGV0IHBsYXllcnM6IFRyYW5zaXRpb25BbmltYXRpb25QbGF5ZXJbXSA9IFtdO1xuICAgIGlmIChpc1F1ZXJpZWRFbGVtZW50KSB7XG4gICAgICBjb25zdCBxdWVyaWVkRWxlbWVudFBsYXllcnMgPSB0aGlzLnBsYXllcnNCeVF1ZXJpZWRFbGVtZW50LmdldChlbGVtZW50KTtcbiAgICAgIGlmIChxdWVyaWVkRWxlbWVudFBsYXllcnMpIHtcbiAgICAgICAgcGxheWVycyA9IHF1ZXJpZWRFbGVtZW50UGxheWVycztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZWxlbWVudFBsYXllcnMgPSB0aGlzLnBsYXllcnNCeUVsZW1lbnQuZ2V0KGVsZW1lbnQpO1xuICAgICAgaWYgKGVsZW1lbnRQbGF5ZXJzKSB7XG4gICAgICAgIGNvbnN0IGlzUmVtb3ZhbEFuaW1hdGlvbiA9ICF0b1N0YXRlVmFsdWUgfHwgdG9TdGF0ZVZhbHVlID09IFZPSURfVkFMVUU7XG4gICAgICAgIGVsZW1lbnRQbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcbiAgICAgICAgICBpZiAocGxheWVyLnF1ZXVlZCkgcmV0dXJuO1xuICAgICAgICAgIGlmICghaXNSZW1vdmFsQW5pbWF0aW9uICYmIHBsYXllci50cmlnZ2VyTmFtZSAhPSB0cmlnZ2VyTmFtZSkgcmV0dXJuO1xuICAgICAgICAgIHBsYXllcnMucHVzaChwbGF5ZXIpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG5hbWVzcGFjZUlkIHx8IHRyaWdnZXJOYW1lKSB7XG4gICAgICBwbGF5ZXJzID0gcGxheWVycy5maWx0ZXIocGxheWVyID0+IHtcbiAgICAgICAgaWYgKG5hbWVzcGFjZUlkICYmIG5hbWVzcGFjZUlkICE9IHBsYXllci5uYW1lc3BhY2VJZCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAodHJpZ2dlck5hbWUgJiYgdHJpZ2dlck5hbWUgIT0gcGxheWVyLnRyaWdnZXJOYW1lKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwbGF5ZXJzO1xuICB9XG5cbiAgcHJpdmF0ZSBfYmVmb3JlQW5pbWF0aW9uQnVpbGQoXG4gICAgICBuYW1lc3BhY2VJZDogc3RyaW5nLCBpbnN0cnVjdGlvbjogQW5pbWF0aW9uVHJhbnNpdGlvbkluc3RydWN0aW9uLFxuICAgICAgYWxsUHJldmlvdXNQbGF5ZXJzTWFwOiBNYXA8YW55LCBUcmFuc2l0aW9uQW5pbWF0aW9uUGxheWVyW10+KSB7XG4gICAgY29uc3QgdHJpZ2dlck5hbWUgPSBpbnN0cnVjdGlvbi50cmlnZ2VyTmFtZTtcbiAgICBjb25zdCByb290RWxlbWVudCA9IGluc3RydWN0aW9uLmVsZW1lbnQ7XG5cbiAgICAvLyB3aGVuIGEgcmVtb3ZhbCBhbmltYXRpb24gb2NjdXJzLCBBTEwgcHJldmlvdXMgcGxheWVycyBhcmUgY29sbGVjdGVkXG4gICAgLy8gYW5kIGRlc3Ryb3llZCAoZXZlbiBpZiB0aGV5IGFyZSBvdXRzaWRlIG9mIHRoZSBjdXJyZW50IG5hbWVzcGFjZSlcbiAgICBjb25zdCB0YXJnZXROYW1lU3BhY2VJZDogc3RyaW5nfHVuZGVmaW5lZCA9XG4gICAgICAgIGluc3RydWN0aW9uLmlzUmVtb3ZhbFRyYW5zaXRpb24gPyB1bmRlZmluZWQgOiBuYW1lc3BhY2VJZDtcbiAgICBjb25zdCB0YXJnZXRUcmlnZ2VyTmFtZTogc3RyaW5nfHVuZGVmaW5lZCA9XG4gICAgICAgIGluc3RydWN0aW9uLmlzUmVtb3ZhbFRyYW5zaXRpb24gPyB1bmRlZmluZWQgOiB0cmlnZ2VyTmFtZTtcblxuICAgIGZvciAoY29uc3QgdGltZWxpbmVJbnN0cnVjdGlvbiBvZiBpbnN0cnVjdGlvbi50aW1lbGluZXMpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aW1lbGluZUluc3RydWN0aW9uLmVsZW1lbnQ7XG4gICAgICBjb25zdCBpc1F1ZXJpZWRFbGVtZW50ID0gZWxlbWVudCAhPT0gcm9vdEVsZW1lbnQ7XG4gICAgICBjb25zdCBwbGF5ZXJzID0gZ2V0T3JTZXRBc0luTWFwKGFsbFByZXZpb3VzUGxheWVyc01hcCwgZWxlbWVudCwgW10pO1xuICAgICAgY29uc3QgcHJldmlvdXNQbGF5ZXJzID0gdGhpcy5fZ2V0UHJldmlvdXNQbGF5ZXJzKFxuICAgICAgICAgIGVsZW1lbnQsIGlzUXVlcmllZEVsZW1lbnQsIHRhcmdldE5hbWVTcGFjZUlkLCB0YXJnZXRUcmlnZ2VyTmFtZSwgaW5zdHJ1Y3Rpb24udG9TdGF0ZSk7XG4gICAgICBwcmV2aW91c1BsYXllcnMuZm9yRWFjaChwbGF5ZXIgPT4ge1xuICAgICAgICBjb25zdCByZWFsUGxheWVyID0gcGxheWVyLmdldFJlYWxQbGF5ZXIoKSBhcyBhbnk7XG4gICAgICAgIGlmIChyZWFsUGxheWVyLmJlZm9yZURlc3Ryb3kpIHtcbiAgICAgICAgICByZWFsUGxheWVyLmJlZm9yZURlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgICBwbGF5ZXIuZGVzdHJveSgpO1xuICAgICAgICBwbGF5ZXJzLnB1c2gocGxheWVyKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIHRoaXMgbmVlZHMgdG8gYmUgZG9uZSBzbyB0aGF0IHRoZSBQUkUvUE9TVCBzdHlsZXMgY2FuIGJlXG4gICAgLy8gY29tcHV0ZWQgcHJvcGVybHkgd2l0aG91dCBpbnRlcmZlcmluZyB3aXRoIHRoZSBwcmV2aW91cyBhbmltYXRpb25cbiAgICBlcmFzZVN0eWxlcyhyb290RWxlbWVudCwgaW5zdHJ1Y3Rpb24uZnJvbVN0eWxlcyk7XG4gIH1cblxuICBwcml2YXRlIF9idWlsZEFuaW1hdGlvbihcbiAgICAgIG5hbWVzcGFjZUlkOiBzdHJpbmcsIGluc3RydWN0aW9uOiBBbmltYXRpb25UcmFuc2l0aW9uSW5zdHJ1Y3Rpb24sXG4gICAgICBhbGxQcmV2aW91c1BsYXllcnNNYXA6IE1hcDxhbnksIFRyYW5zaXRpb25BbmltYXRpb25QbGF5ZXJbXT4sXG4gICAgICBza2lwcGVkUGxheWVyc01hcDogTWFwPGFueSwgQW5pbWF0aW9uUGxheWVyW10+LCBwcmVTdHlsZXNNYXA6IE1hcDxhbnksIMm1U3R5bGVEYXRhPixcbiAgICAgIHBvc3RTdHlsZXNNYXA6IE1hcDxhbnksIMm1U3R5bGVEYXRhPik6IEFuaW1hdGlvblBsYXllciB7XG4gICAgY29uc3QgdHJpZ2dlck5hbWUgPSBpbnN0cnVjdGlvbi50cmlnZ2VyTmFtZTtcbiAgICBjb25zdCByb290RWxlbWVudCA9IGluc3RydWN0aW9uLmVsZW1lbnQ7XG5cbiAgICAvLyB3ZSBmaXJzdCBydW4gdGhpcyBzbyB0aGF0IHRoZSBwcmV2aW91cyBhbmltYXRpb24gcGxheWVyXG4gICAgLy8gZGF0YSBjYW4gYmUgcGFzc2VkIGludG8gdGhlIHN1Y2Nlc3NpdmUgYW5pbWF0aW9uIHBsYXllcnNcbiAgICBjb25zdCBhbGxRdWVyaWVkUGxheWVyczogVHJhbnNpdGlvbkFuaW1hdGlvblBsYXllcltdID0gW107XG4gICAgY29uc3QgYWxsQ29uc3VtZWRFbGVtZW50cyA9IG5ldyBTZXQ8YW55PigpO1xuICAgIGNvbnN0IGFsbFN1YkVsZW1lbnRzID0gbmV3IFNldDxhbnk+KCk7XG4gICAgY29uc3QgYWxsTmV3UGxheWVycyA9IGluc3RydWN0aW9uLnRpbWVsaW5lcy5tYXAodGltZWxpbmVJbnN0cnVjdGlvbiA9PiB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gdGltZWxpbmVJbnN0cnVjdGlvbi5lbGVtZW50O1xuICAgICAgYWxsQ29uc3VtZWRFbGVtZW50cy5hZGQoZWxlbWVudCk7XG5cbiAgICAgIC8vIEZJWE1FIChtYXRza28pOiBtYWtlIHN1cmUgdG8tYmUtcmVtb3ZlZCBhbmltYXRpb25zIGFyZSByZW1vdmVkIHByb3Blcmx5XG4gICAgICBjb25zdCBkZXRhaWxzID0gZWxlbWVudFtSRU1PVkFMX0ZMQUddO1xuICAgICAgaWYgKGRldGFpbHMgJiYgZGV0YWlscy5yZW1vdmVkQmVmb3JlUXVlcmllZClcbiAgICAgICAgcmV0dXJuIG5ldyBOb29wQW5pbWF0aW9uUGxheWVyKHRpbWVsaW5lSW5zdHJ1Y3Rpb24uZHVyYXRpb24sIHRpbWVsaW5lSW5zdHJ1Y3Rpb24uZGVsYXkpO1xuXG4gICAgICBjb25zdCBpc1F1ZXJpZWRFbGVtZW50ID0gZWxlbWVudCAhPT0gcm9vdEVsZW1lbnQ7XG4gICAgICBjb25zdCBwcmV2aW91c1BsYXllcnMgPVxuICAgICAgICAgIGZsYXR0ZW5Hcm91cFBsYXllcnMoKGFsbFByZXZpb3VzUGxheWVyc01hcC5nZXQoZWxlbWVudCkgfHwgRU1QVFlfUExBWUVSX0FSUkFZKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAocCA9PiBwLmdldFJlYWxQbGF5ZXIoKSkpXG4gICAgICAgICAgICAgIC5maWx0ZXIocCA9PiB7XG4gICAgICAgICAgICAgICAgLy8gdGhlIGBlbGVtZW50YCBpcyBub3QgYXBhcnQgb2YgdGhlIEFuaW1hdGlvblBsYXllciBkZWZpbml0aW9uLCBidXRcbiAgICAgICAgICAgICAgICAvLyBNb2NrL1dlYkFuaW1hdGlvbnNcbiAgICAgICAgICAgICAgICAvLyB1c2UgdGhlIGVsZW1lbnQgd2l0aGluIHRoZWlyIGltcGxlbWVudGF0aW9uLiBUaGlzIHdpbGwgYmUgYWRkZWQgaW4gQW5ndWxhcjUgdG9cbiAgICAgICAgICAgICAgICAvLyBBbmltYXRpb25QbGF5ZXJcbiAgICAgICAgICAgICAgICBjb25zdCBwcCA9IHAgYXMgYW55O1xuICAgICAgICAgICAgICAgIHJldHVybiBwcC5lbGVtZW50ID8gcHAuZWxlbWVudCA9PT0gZWxlbWVudCA6IGZhbHNlO1xuICAgICAgICAgICAgICB9KTtcblxuICAgICAgY29uc3QgcHJlU3R5bGVzID0gcHJlU3R5bGVzTWFwLmdldChlbGVtZW50KTtcbiAgICAgIGNvbnN0IHBvc3RTdHlsZXMgPSBwb3N0U3R5bGVzTWFwLmdldChlbGVtZW50KTtcbiAgICAgIGNvbnN0IGtleWZyYW1lcyA9IG5vcm1hbGl6ZUtleWZyYW1lcyhcbiAgICAgICAgICB0aGlzLmRyaXZlciwgdGhpcy5fbm9ybWFsaXplciwgZWxlbWVudCwgdGltZWxpbmVJbnN0cnVjdGlvbi5rZXlmcmFtZXMsIHByZVN0eWxlcyxcbiAgICAgICAgICBwb3N0U3R5bGVzKTtcbiAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMuX2J1aWxkUGxheWVyKHRpbWVsaW5lSW5zdHJ1Y3Rpb24sIGtleWZyYW1lcywgcHJldmlvdXNQbGF5ZXJzKTtcblxuICAgICAgLy8gdGhpcyBtZWFucyB0aGF0IHRoaXMgcGFydGljdWxhciBwbGF5ZXIgYmVsb25ncyB0byBhIHN1YiB0cmlnZ2VyLiBJdCBpc1xuICAgICAgLy8gaW1wb3J0YW50IHRoYXQgd2UgbWF0Y2ggdGhpcyBwbGF5ZXIgdXAgd2l0aCB0aGUgY29ycmVzcG9uZGluZyAoQHRyaWdnZXIubGlzdGVuZXIpXG4gICAgICBpZiAodGltZWxpbmVJbnN0cnVjdGlvbi5zdWJUaW1lbGluZSAmJiBza2lwcGVkUGxheWVyc01hcCkge1xuICAgICAgICBhbGxTdWJFbGVtZW50cy5hZGQoZWxlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc1F1ZXJpZWRFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IHdyYXBwZWRQbGF5ZXIgPSBuZXcgVHJhbnNpdGlvbkFuaW1hdGlvblBsYXllcihuYW1lc3BhY2VJZCwgdHJpZ2dlck5hbWUsIGVsZW1lbnQpO1xuICAgICAgICB3cmFwcGVkUGxheWVyLnNldFJlYWxQbGF5ZXIocGxheWVyKTtcbiAgICAgICAgYWxsUXVlcmllZFBsYXllcnMucHVzaCh3cmFwcGVkUGxheWVyKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBsYXllcjtcbiAgICB9KTtcblxuICAgIGFsbFF1ZXJpZWRQbGF5ZXJzLmZvckVhY2gocGxheWVyID0+IHtcbiAgICAgIGdldE9yU2V0QXNJbk1hcCh0aGlzLnBsYXllcnNCeVF1ZXJpZWRFbGVtZW50LCBwbGF5ZXIuZWxlbWVudCwgW10pLnB1c2gocGxheWVyKTtcbiAgICAgIHBsYXllci5vbkRvbmUoKCkgPT4gZGVsZXRlT3JVbnNldEluTWFwKHRoaXMucGxheWVyc0J5UXVlcmllZEVsZW1lbnQsIHBsYXllci5lbGVtZW50LCBwbGF5ZXIpKTtcbiAgICB9KTtcblxuICAgIGFsbENvbnN1bWVkRWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IGFkZENsYXNzKGVsZW1lbnQsIE5HX0FOSU1BVElOR19DTEFTU05BTUUpKTtcbiAgICBjb25zdCBwbGF5ZXIgPSBvcHRpbWl6ZUdyb3VwUGxheWVyKGFsbE5ld1BsYXllcnMpO1xuICAgIHBsYXllci5vbkRlc3Ryb3koKCkgPT4ge1xuICAgICAgYWxsQ29uc3VtZWRFbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4gcmVtb3ZlQ2xhc3MoZWxlbWVudCwgTkdfQU5JTUFUSU5HX0NMQVNTTkFNRSkpO1xuICAgICAgc2V0U3R5bGVzKHJvb3RFbGVtZW50LCBpbnN0cnVjdGlvbi50b1N0eWxlcyk7XG4gICAgfSk7XG5cbiAgICAvLyB0aGlzIGJhc2ljYWxseSBtYWtlcyBhbGwgb2YgdGhlIGNhbGxiYWNrcyBmb3Igc3ViIGVsZW1lbnQgYW5pbWF0aW9uc1xuICAgIC8vIGJlIGRlcGVuZGVudCBvbiB0aGUgdXBwZXIgcGxheWVycyBmb3Igd2hlbiB0aGV5IGZpbmlzaFxuICAgIGFsbFN1YkVsZW1lbnRzLmZvckVhY2goXG4gICAgICAgIGVsZW1lbnQgPT4geyBnZXRPclNldEFzSW5NYXAoc2tpcHBlZFBsYXllcnNNYXAsIGVsZW1lbnQsIFtdKS5wdXNoKHBsYXllcik7IH0pO1xuXG4gICAgcmV0dXJuIHBsYXllcjtcbiAgfVxuXG4gIHByaXZhdGUgX2J1aWxkUGxheWVyKFxuICAgICAgaW5zdHJ1Y3Rpb246IEFuaW1hdGlvblRpbWVsaW5lSW5zdHJ1Y3Rpb24sIGtleWZyYW1lczogybVTdHlsZURhdGFbXSxcbiAgICAgIHByZXZpb3VzUGxheWVyczogQW5pbWF0aW9uUGxheWVyW10pOiBBbmltYXRpb25QbGF5ZXIge1xuICAgIGlmIChrZXlmcmFtZXMubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHRoaXMuZHJpdmVyLmFuaW1hdGUoXG4gICAgICAgICAgaW5zdHJ1Y3Rpb24uZWxlbWVudCwga2V5ZnJhbWVzLCBpbnN0cnVjdGlvbi5kdXJhdGlvbiwgaW5zdHJ1Y3Rpb24uZGVsYXksXG4gICAgICAgICAgaW5zdHJ1Y3Rpb24uZWFzaW5nLCBwcmV2aW91c1BsYXllcnMpO1xuICAgIH1cblxuICAgIC8vIHNwZWNpYWwgY2FzZSBmb3Igd2hlbiBhbiBlbXB0eSB0cmFuc2l0aW9ufGRlZmluaXRpb24gaXMgcHJvdmlkZWRcbiAgICAvLyAuLi4gdGhlcmUgaXMgbm8gcG9pbnQgaW4gcmVuZGVyaW5nIGFuIGVtcHR5IGFuaW1hdGlvblxuICAgIHJldHVybiBuZXcgTm9vcEFuaW1hdGlvblBsYXllcihpbnN0cnVjdGlvbi5kdXJhdGlvbiwgaW5zdHJ1Y3Rpb24uZGVsYXkpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2l0aW9uQW5pbWF0aW9uUGxheWVyIGltcGxlbWVudHMgQW5pbWF0aW9uUGxheWVyIHtcbiAgcHJpdmF0ZSBfcGxheWVyOiBBbmltYXRpb25QbGF5ZXIgPSBuZXcgTm9vcEFuaW1hdGlvblBsYXllcigpO1xuICBwcml2YXRlIF9jb250YWluc1JlYWxQbGF5ZXIgPSBmYWxzZTtcblxuICBwcml2YXRlIF9xdWV1ZWRDYWxsYmFja3M6IHtbbmFtZTogc3RyaW5nXTogKCgpID0+IGFueSlbXX0gPSB7fTtcbiAgcHVibGljIHJlYWRvbmx5IGRlc3Ryb3llZCA9IGZhbHNlO1xuICBwdWJsaWMgcGFyZW50UGxheWVyOiBBbmltYXRpb25QbGF5ZXI7XG5cbiAgcHVibGljIG1hcmtlZEZvckRlc3Ryb3k6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIGRpc2FibGVkID0gZmFsc2U7XG5cbiAgcmVhZG9ubHkgcXVldWVkOiBib29sZWFuID0gdHJ1ZTtcbiAgcHVibGljIHJlYWRvbmx5IHRvdGFsVGltZTogbnVtYmVyID0gMDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZXNwYWNlSWQ6IHN0cmluZywgcHVibGljIHRyaWdnZXJOYW1lOiBzdHJpbmcsIHB1YmxpYyBlbGVtZW50OiBhbnkpIHt9XG5cbiAgc2V0UmVhbFBsYXllcihwbGF5ZXI6IEFuaW1hdGlvblBsYXllcikge1xuICAgIGlmICh0aGlzLl9jb250YWluc1JlYWxQbGF5ZXIpIHJldHVybjtcblxuICAgIHRoaXMuX3BsYXllciA9IHBsYXllcjtcbiAgICBPYmplY3Qua2V5cyh0aGlzLl9xdWV1ZWRDYWxsYmFja3MpLmZvckVhY2gocGhhc2UgPT4ge1xuICAgICAgdGhpcy5fcXVldWVkQ2FsbGJhY2tzW3BoYXNlXS5mb3JFYWNoKFxuICAgICAgICAgIGNhbGxiYWNrID0+IGxpc3Rlbk9uUGxheWVyKHBsYXllciwgcGhhc2UsIHVuZGVmaW5lZCwgY2FsbGJhY2spKTtcbiAgICB9KTtcbiAgICB0aGlzLl9xdWV1ZWRDYWxsYmFja3MgPSB7fTtcbiAgICB0aGlzLl9jb250YWluc1JlYWxQbGF5ZXIgPSB0cnVlO1xuICAgIHRoaXMub3ZlcnJpZGVUb3RhbFRpbWUocGxheWVyLnRvdGFsVGltZSk7XG4gICAgKHRoaXMgYXN7cXVldWVkOiBib29sZWFufSkucXVldWVkID0gZmFsc2U7XG4gIH1cblxuICBnZXRSZWFsUGxheWVyKCkgeyByZXR1cm4gdGhpcy5fcGxheWVyOyB9XG5cbiAgb3ZlcnJpZGVUb3RhbFRpbWUodG90YWxUaW1lOiBudW1iZXIpIHsgKHRoaXMgYXMgYW55KS50b3RhbFRpbWUgPSB0b3RhbFRpbWU7IH1cblxuICBzeW5jUGxheWVyRXZlbnRzKHBsYXllcjogQW5pbWF0aW9uUGxheWVyKSB7XG4gICAgY29uc3QgcCA9IHRoaXMuX3BsYXllciBhcyBhbnk7XG4gICAgaWYgKHAudHJpZ2dlckNhbGxiYWNrKSB7XG4gICAgICBwbGF5ZXIub25TdGFydCgoKSA9PiBwLnRyaWdnZXJDYWxsYmFjayAhKCdzdGFydCcpKTtcbiAgICB9XG4gICAgcGxheWVyLm9uRG9uZSgoKSA9PiB0aGlzLmZpbmlzaCgpKTtcbiAgICBwbGF5ZXIub25EZXN0cm95KCgpID0+IHRoaXMuZGVzdHJveSgpKTtcbiAgfVxuXG4gIHByaXZhdGUgX3F1ZXVlRXZlbnQobmFtZTogc3RyaW5nLCBjYWxsYmFjazogKGV2ZW50OiBhbnkpID0+IGFueSk6IHZvaWQge1xuICAgIGdldE9yU2V0QXNJbk1hcCh0aGlzLl9xdWV1ZWRDYWxsYmFja3MsIG5hbWUsIFtdKS5wdXNoKGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uRG9uZShmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnF1ZXVlZCkge1xuICAgICAgdGhpcy5fcXVldWVFdmVudCgnZG9uZScsIGZuKTtcbiAgICB9XG4gICAgdGhpcy5fcGxheWVyLm9uRG9uZShmbik7XG4gIH1cblxuICBvblN0YXJ0KGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucXVldWVkKSB7XG4gICAgICB0aGlzLl9xdWV1ZUV2ZW50KCdzdGFydCcsIGZuKTtcbiAgICB9XG4gICAgdGhpcy5fcGxheWVyLm9uU3RhcnQoZm4pO1xuICB9XG5cbiAgb25EZXN0cm95KGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucXVldWVkKSB7XG4gICAgICB0aGlzLl9xdWV1ZUV2ZW50KCdkZXN0cm95JywgZm4pO1xuICAgIH1cbiAgICB0aGlzLl9wbGF5ZXIub25EZXN0cm95KGZuKTtcbiAgfVxuXG4gIGluaXQoKTogdm9pZCB7IHRoaXMuX3BsYXllci5pbml0KCk7IH1cblxuICBoYXNTdGFydGVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5xdWV1ZWQgPyBmYWxzZSA6IHRoaXMuX3BsYXllci5oYXNTdGFydGVkKCk7IH1cblxuICBwbGF5KCk6IHZvaWQgeyAhdGhpcy5xdWV1ZWQgJiYgdGhpcy5fcGxheWVyLnBsYXkoKTsgfVxuXG4gIHBhdXNlKCk6IHZvaWQgeyAhdGhpcy5xdWV1ZWQgJiYgdGhpcy5fcGxheWVyLnBhdXNlKCk7IH1cblxuICByZXN0YXJ0KCk6IHZvaWQgeyAhdGhpcy5xdWV1ZWQgJiYgdGhpcy5fcGxheWVyLnJlc3RhcnQoKTsgfVxuXG4gIGZpbmlzaCgpOiB2b2lkIHsgdGhpcy5fcGxheWVyLmZpbmlzaCgpOyB9XG5cbiAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICAodGhpcyBhc3tkZXN0cm95ZWQ6IGJvb2xlYW59KS5kZXN0cm95ZWQgPSB0cnVlO1xuICAgIHRoaXMuX3BsYXllci5kZXN0cm95KCk7XG4gIH1cblxuICByZXNldCgpOiB2b2lkIHsgIXRoaXMucXVldWVkICYmIHRoaXMuX3BsYXllci5yZXNldCgpOyB9XG5cbiAgc2V0UG9zaXRpb24ocDogYW55KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnF1ZXVlZCkge1xuICAgICAgdGhpcy5fcGxheWVyLnNldFBvc2l0aW9uKHApO1xuICAgIH1cbiAgfVxuXG4gIGdldFBvc2l0aW9uKCk6IG51bWJlciB7IHJldHVybiB0aGlzLnF1ZXVlZCA/IDAgOiB0aGlzLl9wbGF5ZXIuZ2V0UG9zaXRpb24oKTsgfVxuXG4gIC8qIEBpbnRlcm5hbCAqL1xuICB0cmlnZ2VyQ2FsbGJhY2socGhhc2VOYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBwID0gdGhpcy5fcGxheWVyIGFzIGFueTtcbiAgICBpZiAocC50cmlnZ2VyQ2FsbGJhY2spIHtcbiAgICAgIHAudHJpZ2dlckNhbGxiYWNrKHBoYXNlTmFtZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZU9yVW5zZXRJbk1hcChtYXA6IE1hcDxhbnksIGFueVtdPnwge1trZXk6IHN0cmluZ106IGFueX0sIGtleTogYW55LCB2YWx1ZTogYW55KSB7XG4gIGxldCBjdXJyZW50VmFsdWVzOiBhbnlbXXxudWxsfHVuZGVmaW5lZDtcbiAgaWYgKG1hcCBpbnN0YW5jZW9mIE1hcCkge1xuICAgIGN1cnJlbnRWYWx1ZXMgPSBtYXAuZ2V0KGtleSk7XG4gICAgaWYgKGN1cnJlbnRWYWx1ZXMpIHtcbiAgICAgIGlmIChjdXJyZW50VmFsdWVzLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBpbmRleCA9IGN1cnJlbnRWYWx1ZXMuaW5kZXhPZih2YWx1ZSk7XG4gICAgICAgIGN1cnJlbnRWYWx1ZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChjdXJyZW50VmFsdWVzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIG1hcC5kZWxldGUoa2V5KTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY3VycmVudFZhbHVlcyA9IG1hcFtrZXldO1xuICAgIGlmIChjdXJyZW50VmFsdWVzKSB7XG4gICAgICBpZiAoY3VycmVudFZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBjdXJyZW50VmFsdWVzLmluZGV4T2YodmFsdWUpO1xuICAgICAgICBjdXJyZW50VmFsdWVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9XG4gICAgICBpZiAoY3VycmVudFZhbHVlcy5sZW5ndGggPT0gMCkge1xuICAgICAgICBkZWxldGUgbWFwW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBjdXJyZW50VmFsdWVzO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVUcmlnZ2VyVmFsdWUodmFsdWU6IGFueSk6IGFueSB7XG4gIC8vIHdlIHVzZSBgIT0gbnVsbGAgaGVyZSBiZWNhdXNlIGl0J3MgdGhlIG1vc3Qgc2ltcGxlXG4gIC8vIHdheSB0byB0ZXN0IGFnYWluc3QgYSBcImZhbHN5XCIgdmFsdWUgd2l0aG91dCBtaXhpbmdcbiAgLy8gaW4gZW1wdHkgc3RyaW5ncyBvciBhIHplcm8gdmFsdWUuIERPIE5PVCBPUFRJTUlaRS5cbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgPyB2YWx1ZSA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzRWxlbWVudE5vZGUobm9kZTogYW55KSB7XG4gIHJldHVybiBub2RlICYmIG5vZGVbJ25vZGVUeXBlJ10gPT09IDE7XG59XG5cbmZ1bmN0aW9uIGlzVHJpZ2dlckV2ZW50VmFsaWQoZXZlbnROYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGV2ZW50TmFtZSA9PSAnc3RhcnQnIHx8IGV2ZW50TmFtZSA9PSAnZG9uZSc7XG59XG5cbmZ1bmN0aW9uIGNsb2FrRWxlbWVudChlbGVtZW50OiBhbnksIHZhbHVlPzogc3RyaW5nKSB7XG4gIGNvbnN0IG9sZFZhbHVlID0gZWxlbWVudC5zdHlsZS5kaXNwbGF5O1xuICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSB2YWx1ZSAhPSBudWxsID8gdmFsdWUgOiAnbm9uZSc7XG4gIHJldHVybiBvbGRWYWx1ZTtcbn1cblxuZnVuY3Rpb24gY2xvYWtBbmRDb21wdXRlU3R5bGVzKFxuICAgIHZhbHVlc01hcDogTWFwPGFueSwgybVTdHlsZURhdGE+LCBkcml2ZXI6IEFuaW1hdGlvbkRyaXZlciwgZWxlbWVudHM6IFNldDxhbnk+LFxuICAgIGVsZW1lbnRQcm9wc01hcDogTWFwPGFueSwgU2V0PHN0cmluZz4+LCBkZWZhdWx0U3R5bGU6IHN0cmluZyk6IGFueVtdIHtcbiAgY29uc3QgY2xvYWtWYWxzOiBzdHJpbmdbXSA9IFtdO1xuICBlbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4gY2xvYWtWYWxzLnB1c2goY2xvYWtFbGVtZW50KGVsZW1lbnQpKSk7XG5cbiAgY29uc3QgZmFpbGVkRWxlbWVudHM6IGFueVtdID0gW107XG5cbiAgZWxlbWVudFByb3BzTWFwLmZvckVhY2goKHByb3BzOiBTZXQ8c3RyaW5nPiwgZWxlbWVudDogYW55KSA9PiB7XG4gICAgY29uc3Qgc3R5bGVzOiDJtVN0eWxlRGF0YSA9IHt9O1xuICAgIHByb3BzLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHN0eWxlc1twcm9wXSA9IGRyaXZlci5jb21wdXRlU3R5bGUoZWxlbWVudCwgcHJvcCwgZGVmYXVsdFN0eWxlKTtcblxuICAgICAgLy8gdGhlcmUgaXMgbm8gZWFzeSB3YXkgdG8gZGV0ZWN0IHRoaXMgYmVjYXVzZSBhIHN1YiBlbGVtZW50IGNvdWxkIGJlIHJlbW92ZWRcbiAgICAgIC8vIGJ5IGEgcGFyZW50IGFuaW1hdGlvbiBlbGVtZW50IGJlaW5nIGRldGFjaGVkLlxuICAgICAgaWYgKCF2YWx1ZSB8fCB2YWx1ZS5sZW5ndGggPT0gMCkge1xuICAgICAgICBlbGVtZW50W1JFTU9WQUxfRkxBR10gPSBOVUxMX1JFTU9WRURfUVVFUklFRF9TVEFURTtcbiAgICAgICAgZmFpbGVkRWxlbWVudHMucHVzaChlbGVtZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB2YWx1ZXNNYXAuc2V0KGVsZW1lbnQsIHN0eWxlcyk7XG4gIH0pO1xuXG4gIC8vIHdlIHVzZSBhIGluZGV4IHZhcmlhYmxlIGhlcmUgc2luY2UgU2V0LmZvckVhY2goYSwgaSkgZG9lcyBub3QgcmV0dXJuXG4gIC8vIGFuIGluZGV4IHZhbHVlIGZvciB0aGUgY2xvc3VyZSAoYnV0IGluc3RlYWQganVzdCB0aGUgdmFsdWUpXG4gIGxldCBpID0gMDtcbiAgZWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IGNsb2FrRWxlbWVudChlbGVtZW50LCBjbG9ha1ZhbHNbaSsrXSkpO1xuXG4gIHJldHVybiBmYWlsZWRFbGVtZW50cztcbn1cblxuLypcblNpbmNlIHRoZSBBbmd1bGFyIHJlbmRlcmVyIGNvZGUgd2lsbCByZXR1cm4gYSBjb2xsZWN0aW9uIG9mIGluc2VydGVkXG5ub2RlcyBpbiBhbGwgYXJlYXMgb2YgYSBET00gdHJlZSwgaXQncyB1cCB0byB0aGlzIGFsZ29yaXRobSB0byBmaWd1cmVcbm91dCB3aGljaCBub2RlcyBhcmUgcm9vdHMgZm9yIGVhY2ggYW5pbWF0aW9uIEB0cmlnZ2VyLlxuXG5CeSBwbGFjaW5nIGVhY2ggaW5zZXJ0ZWQgbm9kZSBpbnRvIGEgU2V0IGFuZCB0cmF2ZXJzaW5nIHVwd2FyZHMsIGl0XG5pcyBwb3NzaWJsZSB0byBmaW5kIHRoZSBAdHJpZ2dlciBlbGVtZW50cyBhbmQgd2VsbCBhbnkgZGlyZWN0ICpzdGFyXG5pbnNlcnRpb24gbm9kZXMsIGlmIGEgQHRyaWdnZXIgcm9vdCBpcyBmb3VuZCB0aGVuIHRoZSBlbnRlciBlbGVtZW50XG5pcyBwbGFjZWQgaW50byB0aGUgTWFwW0B0cmlnZ2VyXSBzcG90LlxuICovXG5mdW5jdGlvbiBidWlsZFJvb3RNYXAocm9vdHM6IGFueVtdLCBub2RlczogYW55W10pOiBNYXA8YW55LCBhbnlbXT4ge1xuICBjb25zdCByb290TWFwID0gbmV3IE1hcDxhbnksIGFueVtdPigpO1xuICByb290cy5mb3JFYWNoKHJvb3QgPT4gcm9vdE1hcC5zZXQocm9vdCwgW10pKTtcblxuICBpZiAobm9kZXMubGVuZ3RoID09IDApIHJldHVybiByb290TWFwO1xuXG4gIGNvbnN0IE5VTExfTk9ERSA9IDE7XG4gIGNvbnN0IG5vZGVTZXQgPSBuZXcgU2V0KG5vZGVzKTtcbiAgY29uc3QgbG9jYWxSb290TWFwID0gbmV3IE1hcDxhbnksIGFueT4oKTtcblxuICBmdW5jdGlvbiBnZXRSb290KG5vZGU6IGFueSk6IGFueSB7XG4gICAgaWYgKCFub2RlKSByZXR1cm4gTlVMTF9OT0RFO1xuXG4gICAgbGV0IHJvb3QgPSBsb2NhbFJvb3RNYXAuZ2V0KG5vZGUpO1xuICAgIGlmIChyb290KSByZXR1cm4gcm9vdDtcblxuICAgIGNvbnN0IHBhcmVudCA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICBpZiAocm9vdE1hcC5oYXMocGFyZW50KSkgeyAgLy8gbmdJZiBpbnNpZGUgQHRyaWdnZXJcbiAgICAgIHJvb3QgPSBwYXJlbnQ7XG4gICAgfSBlbHNlIGlmIChub2RlU2V0LmhhcyhwYXJlbnQpKSB7ICAvLyBuZ0lmIGluc2lkZSBuZ0lmXG4gICAgICByb290ID0gTlVMTF9OT0RFO1xuICAgIH0gZWxzZSB7ICAvLyByZWN1cnNlIHVwd2FyZHNcbiAgICAgIHJvb3QgPSBnZXRSb290KHBhcmVudCk7XG4gICAgfVxuXG4gICAgbG9jYWxSb290TWFwLnNldChub2RlLCByb290KTtcbiAgICByZXR1cm4gcm9vdDtcbiAgfVxuXG4gIG5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgY29uc3Qgcm9vdCA9IGdldFJvb3Qobm9kZSk7XG4gICAgaWYgKHJvb3QgIT09IE5VTExfTk9ERSkge1xuICAgICAgcm9vdE1hcC5nZXQocm9vdCkgIS5wdXNoKG5vZGUpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHJvb3RNYXA7XG59XG5cbmNvbnN0IENMQVNTRVNfQ0FDSEVfS0VZID0gJyQkY2xhc3Nlcyc7XG5mdW5jdGlvbiBjb250YWluc0NsYXNzKGVsZW1lbnQ6IGFueSwgY2xhc3NOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSB7XG4gICAgcmV0dXJuIGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgY2xhc3NlcyA9IGVsZW1lbnRbQ0xBU1NFU19DQUNIRV9LRVldO1xuICAgIHJldHVybiBjbGFzc2VzICYmIGNsYXNzZXNbY2xhc3NOYW1lXTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRDbGFzcyhlbGVtZW50OiBhbnksIGNsYXNzTmFtZTogc3RyaW5nKSB7XG4gIGlmIChlbGVtZW50LmNsYXNzTGlzdCkge1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICB9IGVsc2Uge1xuICAgIGxldCBjbGFzc2VzOiB7W2NsYXNzTmFtZTogc3RyaW5nXTogYm9vbGVhbn0gPSBlbGVtZW50W0NMQVNTRVNfQ0FDSEVfS0VZXTtcbiAgICBpZiAoIWNsYXNzZXMpIHtcbiAgICAgIGNsYXNzZXMgPSBlbGVtZW50W0NMQVNTRVNfQ0FDSEVfS0VZXSA9IHt9O1xuICAgIH1cbiAgICBjbGFzc2VzW2NsYXNzTmFtZV0gPSB0cnVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUNsYXNzKGVsZW1lbnQ6IGFueSwgY2xhc3NOYW1lOiBzdHJpbmcpIHtcbiAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSB7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gIH0gZWxzZSB7XG4gICAgbGV0IGNsYXNzZXM6IHtbY2xhc3NOYW1lOiBzdHJpbmddOiBib29sZWFufSA9IGVsZW1lbnRbQ0xBU1NFU19DQUNIRV9LRVldO1xuICAgIGlmIChjbGFzc2VzKSB7XG4gICAgICBkZWxldGUgY2xhc3Nlc1tjbGFzc05hbWVdO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmVOb2Rlc0FmdGVyQW5pbWF0aW9uRG9uZShcbiAgICBlbmdpbmU6IFRyYW5zaXRpb25BbmltYXRpb25FbmdpbmUsIGVsZW1lbnQ6IGFueSwgcGxheWVyczogQW5pbWF0aW9uUGxheWVyW10pIHtcbiAgb3B0aW1pemVHcm91cFBsYXllcihwbGF5ZXJzKS5vbkRvbmUoKCkgPT4gZW5naW5lLnByb2Nlc3NMZWF2ZU5vZGUoZWxlbWVudCkpO1xufVxuXG5mdW5jdGlvbiBmbGF0dGVuR3JvdXBQbGF5ZXJzKHBsYXllcnM6IEFuaW1hdGlvblBsYXllcltdKTogQW5pbWF0aW9uUGxheWVyW10ge1xuICBjb25zdCBmaW5hbFBsYXllcnM6IEFuaW1hdGlvblBsYXllcltdID0gW107XG4gIF9mbGF0dGVuR3JvdXBQbGF5ZXJzUmVjdXIocGxheWVycywgZmluYWxQbGF5ZXJzKTtcbiAgcmV0dXJuIGZpbmFsUGxheWVycztcbn1cblxuZnVuY3Rpb24gX2ZsYXR0ZW5Hcm91cFBsYXllcnNSZWN1cihwbGF5ZXJzOiBBbmltYXRpb25QbGF5ZXJbXSwgZmluYWxQbGF5ZXJzOiBBbmltYXRpb25QbGF5ZXJbXSkge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBwbGF5ZXIgPSBwbGF5ZXJzW2ldO1xuICAgIGlmIChwbGF5ZXIgaW5zdGFuY2VvZiBBbmltYXRpb25Hcm91cFBsYXllcikge1xuICAgICAgX2ZsYXR0ZW5Hcm91cFBsYXllcnNSZWN1cihwbGF5ZXIucGxheWVycywgZmluYWxQbGF5ZXJzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmluYWxQbGF5ZXJzLnB1c2gocGxheWVyIGFzIEFuaW1hdGlvblBsYXllcik7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG9iakVxdWFscyhhOiB7W2tleTogc3RyaW5nXTogYW55fSwgYjoge1trZXk6IHN0cmluZ106IGFueX0pOiBib29sZWFuIHtcbiAgY29uc3QgazEgPSBPYmplY3Qua2V5cyhhKTtcbiAgY29uc3QgazIgPSBPYmplY3Qua2V5cyhiKTtcbiAgaWYgKGsxLmxlbmd0aCAhPSBrMi5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBrMS5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHByb3AgPSBrMVtpXTtcbiAgICBpZiAoIWIuaGFzT3duUHJvcGVydHkocHJvcCkgfHwgYVtwcm9wXSAhPT0gYltwcm9wXSkgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiByZXBsYWNlUG9zdFN0eWxlc0FzUHJlKFxuICAgIGVsZW1lbnQ6IGFueSwgYWxsUHJlU3R5bGVFbGVtZW50czogTWFwPGFueSwgU2V0PHN0cmluZz4+LFxuICAgIGFsbFBvc3RTdHlsZUVsZW1lbnRzOiBNYXA8YW55LCBTZXQ8c3RyaW5nPj4pOiBib29sZWFuIHtcbiAgY29uc3QgcG9zdEVudHJ5ID0gYWxsUG9zdFN0eWxlRWxlbWVudHMuZ2V0KGVsZW1lbnQpO1xuICBpZiAoIXBvc3RFbnRyeSkgcmV0dXJuIGZhbHNlO1xuXG4gIGxldCBwcmVFbnRyeSA9IGFsbFByZVN0eWxlRWxlbWVudHMuZ2V0KGVsZW1lbnQpO1xuICBpZiAocHJlRW50cnkpIHtcbiAgICBwb3N0RW50cnkuZm9yRWFjaChkYXRhID0+IHByZUVudHJ5ICEuYWRkKGRhdGEpKTtcbiAgfSBlbHNlIHtcbiAgICBhbGxQcmVTdHlsZUVsZW1lbnRzLnNldChlbGVtZW50LCBwb3N0RW50cnkpO1xuICB9XG5cbiAgYWxsUG9zdFN0eWxlRWxlbWVudHMuZGVsZXRlKGVsZW1lbnQpO1xuICByZXR1cm4gdHJ1ZTtcbn1cbiJdfQ==