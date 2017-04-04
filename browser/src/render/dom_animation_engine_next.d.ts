/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AnimationPlayer, AnimationTriggerMetadata } from '@angular/animations';
import { AnimationEngine } from '../animation_engine';
import { AnimationStyleNormalizer } from '../dsl/style_normalization/animation_style_normalizer';
import { AnimationDriver } from './animation_driver';
export declare class DomAnimationEngine implements AnimationEngine {
    private _transitionEngine;
    private _timelineEngine;
    private _triggerCache;
    onRemovalComplete: (element: any, context: any) => void;
    constructor(driver: AnimationDriver, normalizer: AnimationStyleNormalizer);
    registerTrigger(componentId: string, namespaceId: string, hostElement: any, name: string, metadata: AnimationTriggerMetadata): void;
    destroy(namespaceId: string, context: any): void;
    onInsert(namespaceId: string, element: any, parent: any, insertBefore: boolean): void;
    onRemove(namespaceId: string, element: any, context: any): void;
    setProperty(namespaceId: string, element: any, property: string, value: any): boolean;
    listen(namespaceId: string, element: any, eventName: string, eventPhase: string, callback: (event: any) => any): () => any;
    flush(): void;
    readonly players: AnimationPlayer[];
}
