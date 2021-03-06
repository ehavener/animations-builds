/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * An injectable service that produces an animation sequence programmatically within an
 * Angular component or directive.
 * Provided by the `BrowserAnimationsModule` or `NoopAnimationsModule`.
 *
 * \@usageNotes
 *
 * To use this service, add it to your component or directive as a dependency.
 * The service is instantiated along with your component.
 *
 * Apps do not typically need to create their own animation players, but if you
 * do need to, follow these steps:
 *
 * 1. Use the `build()` method to create a programmatic animation using the
 * `animate()` function. The method returns an `AnimationFactory` instance.
 *
 * 2. Use the factory object to create an `AnimationPlayer` and attach it to a DOM element.
 *
 * 3. Use the player object to control the animation programmatically.
 *
 * For example:
 *
 * ```ts
 * // import the service from BrowserAnimationsModule
 * import {AnimationBuilder} from '\@angular/animations';
 * // require the service as a dependency
 * class MyCmp {
 *   constructor(private _builder: AnimationBuilder) {}
 *
 *   makeAnimation(element: any) {
 *     // first define a reusable animation
 *     const myAnimation = this._builder.build([
 *       style({ width: 0 }),
 *       animate(1000, style({ width: '100px' }))
 *     ]);
 *
 *     // use the returned factory object to create a player
 *     const player = myAnimation.create(element);
 *
 *     player.play();
 *   }
 * }
 * ```
 *
 * @abstract
 */
export class AnimationBuilder {
}
if (false) {
    /**
     * Builds a factory for producing a defined animation.
     * @see `animate()`
     * @abstract
     * @param {?} animation A reusable animation definition.
     * @return {?} A factory object that can create a player for the defined animation.
     */
    AnimationBuilder.prototype.build = function (animation) { };
}
/**
 * A factory object returned from the `AnimationBuilder`.`build()` method.
 *
 * @abstract
 */
export class AnimationFactory {
}
if (false) {
    /**
     * Creates an `AnimationPlayer` instance for the reusable animation defined by
     * the `AnimationBuilder`.`build()` method that created this factory.
     * Attaches the new player a DOM element.
     * @abstract
     * @param {?} element The DOM element to which to attach the animation.
     * @param {?=} options A set of options that can include a time delay and
     * additional developer-defined parameters.
     * @return {?}
     */
    AnimationFactory.prototype.create = function (element, options) { };
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX2J1aWxkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9hbmltYXRpb25zL3NyYy9hbmltYXRpb25fYnVpbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVEQSxNQUFNLE9BQWdCLGdCQUFnQjtDQVFyQzs7Ozs7Ozs7Ozs7Ozs7OztBQU1ELE1BQU0sT0FBZ0IsZ0JBQWdCO0NBVXJDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtBbmltYXRpb25NZXRhZGF0YSwgQW5pbWF0aW9uT3B0aW9uc30gZnJvbSAnLi9hbmltYXRpb25fbWV0YWRhdGEnO1xuaW1wb3J0IHtBbmltYXRpb25QbGF5ZXJ9IGZyb20gJy4vcGxheWVycy9hbmltYXRpb25fcGxheWVyJztcblxuLyoqXG4gKiBBbiBpbmplY3RhYmxlIHNlcnZpY2UgdGhhdCBwcm9kdWNlcyBhbiBhbmltYXRpb24gc2VxdWVuY2UgcHJvZ3JhbW1hdGljYWxseSB3aXRoaW4gYW5cbiAqIEFuZ3VsYXIgY29tcG9uZW50IG9yIGRpcmVjdGl2ZS5cbiAqIFByb3ZpZGVkIGJ5IHRoZSBgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGVgIG9yIGBOb29wQW5pbWF0aW9uc01vZHVsZWAuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiBUbyB1c2UgdGhpcyBzZXJ2aWNlLCBhZGQgaXQgdG8geW91ciBjb21wb25lbnQgb3IgZGlyZWN0aXZlIGFzIGEgZGVwZW5kZW5jeS5cbiAqIFRoZSBzZXJ2aWNlIGlzIGluc3RhbnRpYXRlZCBhbG9uZyB3aXRoIHlvdXIgY29tcG9uZW50LlxuICpcbiAqIEFwcHMgZG8gbm90IHR5cGljYWxseSBuZWVkIHRvIGNyZWF0ZSB0aGVpciBvd24gYW5pbWF0aW9uIHBsYXllcnMsIGJ1dCBpZiB5b3VcbiAqIGRvIG5lZWQgdG8sIGZvbGxvdyB0aGVzZSBzdGVwczpcbiAqXG4gKiAxLiBVc2UgdGhlIGBidWlsZCgpYCBtZXRob2QgdG8gY3JlYXRlIGEgcHJvZ3JhbW1hdGljIGFuaW1hdGlvbiB1c2luZyB0aGVcbiAqIGBhbmltYXRlKClgIGZ1bmN0aW9uLiBUaGUgbWV0aG9kIHJldHVybnMgYW4gYEFuaW1hdGlvbkZhY3RvcnlgIGluc3RhbmNlLlxuICpcbiAqIDIuIFVzZSB0aGUgZmFjdG9yeSBvYmplY3QgdG8gY3JlYXRlIGFuIGBBbmltYXRpb25QbGF5ZXJgIGFuZCBhdHRhY2ggaXQgdG8gYSBET00gZWxlbWVudC5cbiAqXG4gKiAzLiBVc2UgdGhlIHBsYXllciBvYmplY3QgdG8gY29udHJvbCB0aGUgYW5pbWF0aW9uIHByb2dyYW1tYXRpY2FsbHkuXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKlxuICogYGBgdHNcbiAqIC8vIGltcG9ydCB0aGUgc2VydmljZSBmcm9tIEJyb3dzZXJBbmltYXRpb25zTW9kdWxlXG4gKiBpbXBvcnQge0FuaW1hdGlvbkJ1aWxkZXJ9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuICogLy8gcmVxdWlyZSB0aGUgc2VydmljZSBhcyBhIGRlcGVuZGVuY3lcbiAqIGNsYXNzIE15Q21wIHtcbiAqICAgY29uc3RydWN0b3IocHJpdmF0ZSBfYnVpbGRlcjogQW5pbWF0aW9uQnVpbGRlcikge31cbiAqXG4gKiAgIG1ha2VBbmltYXRpb24oZWxlbWVudDogYW55KSB7XG4gKiAgICAgLy8gZmlyc3QgZGVmaW5lIGEgcmV1c2FibGUgYW5pbWF0aW9uXG4gKiAgICAgY29uc3QgbXlBbmltYXRpb24gPSB0aGlzLl9idWlsZGVyLmJ1aWxkKFtcbiAqICAgICAgIHN0eWxlKHsgd2lkdGg6IDAgfSksXG4gKiAgICAgICBhbmltYXRlKDEwMDAsIHN0eWxlKHsgd2lkdGg6ICcxMDBweCcgfSkpXG4gKiAgICAgXSk7XG4gKlxuICogICAgIC8vIHVzZSB0aGUgcmV0dXJuZWQgZmFjdG9yeSBvYmplY3QgdG8gY3JlYXRlIGEgcGxheWVyXG4gKiAgICAgY29uc3QgcGxheWVyID0gbXlBbmltYXRpb24uY3JlYXRlKGVsZW1lbnQpO1xuICpcbiAqICAgICBwbGF5ZXIucGxheSgpO1xuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBbmltYXRpb25CdWlsZGVyIHtcbiAgLyoqXG4gICAqIEJ1aWxkcyBhIGZhY3RvcnkgZm9yIHByb2R1Y2luZyBhIGRlZmluZWQgYW5pbWF0aW9uLiBcbiAgICogQHBhcmFtIGFuaW1hdGlvbiBBIHJldXNhYmxlIGFuaW1hdGlvbiBkZWZpbml0aW9uLlxuICAgKiBAcmV0dXJucyBBIGZhY3Rvcnkgb2JqZWN0IHRoYXQgY2FuIGNyZWF0ZSBhIHBsYXllciBmb3IgdGhlIGRlZmluZWQgYW5pbWF0aW9uLlxuICAgKiBAc2VlIGBhbmltYXRlKClgXG4gICAqL1xuICBhYnN0cmFjdCBidWlsZChhbmltYXRpb246IEFuaW1hdGlvbk1ldGFkYXRhfEFuaW1hdGlvbk1ldGFkYXRhW10pOiBBbmltYXRpb25GYWN0b3J5O1xufVxuXG4vKipcbiAqIEEgZmFjdG9yeSBvYmplY3QgcmV0dXJuZWQgZnJvbSB0aGUgYEFuaW1hdGlvbkJ1aWxkZXJgLmBidWlsZCgpYCBtZXRob2QuXG4gKlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQW5pbWF0aW9uRmFjdG9yeSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGBBbmltYXRpb25QbGF5ZXJgIGluc3RhbmNlIGZvciB0aGUgcmV1c2FibGUgYW5pbWF0aW9uIGRlZmluZWQgYnlcbiAgICogdGhlIGBBbmltYXRpb25CdWlsZGVyYC5gYnVpbGQoKWAgbWV0aG9kIHRoYXQgY3JlYXRlZCB0aGlzIGZhY3RvcnkuXG4gICAqIEF0dGFjaGVzIHRoZSBuZXcgcGxheWVyIGEgRE9NIGVsZW1lbnQuXG4gICAqIEBwYXJhbSBlbGVtZW50IFRoZSBET00gZWxlbWVudCB0byB3aGljaCB0byBhdHRhY2ggdGhlIGFuaW1hdGlvbi5cbiAgICogQHBhcmFtIG9wdGlvbnMgQSBzZXQgb2Ygb3B0aW9ucyB0aGF0IGNhbiBpbmNsdWRlIGEgdGltZSBkZWxheSBhbmRcbiAgICogYWRkaXRpb25hbCBkZXZlbG9wZXItZGVmaW5lZCBwYXJhbWV0ZXJzLlxuICAgKi9cbiAgYWJzdHJhY3QgY3JlYXRlKGVsZW1lbnQ6IGFueSwgb3B0aW9ucz86IEFuaW1hdGlvbk9wdGlvbnMpOiBBbmltYXRpb25QbGF5ZXI7XG59XG4iXX0=