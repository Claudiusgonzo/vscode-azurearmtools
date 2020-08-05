// ---------------------------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.md in the project root for license information.
// ---------------------------------------------------------------------------------------------

import { ArrayValue, BooleanValue, NullValue, NumberValue, ObjectValue, Property, StringValue, Value, Visitor } from "./JSON";

/**
 * A TLE visitor that searches a JSON value tree looking for all parents of a given node
 */
// NOTE: This is necessary because the tree doesn't have backpointers, there's probably no good
// reason not to add backpointers at some point.

export class FindJsonLineageVisitor extends Visitor {
    private _lineage: (ArrayValue | ObjectValue | Property)[];
    private _foundLineageValues: (ArrayValue | ObjectValue | Property)[] | undefined;

    constructor(
        private readonly searchDescendent: Value
    ) {
        super();
        this._lineage = [];
    }

    public visitStringValue(stringValue: StringValue): void {
        if (stringValue === this.searchDescendent) {
            this.found();
        }
    }

    public visitNumberValue(numberValue: NumberValue): void {
        if (numberValue === this.searchDescendent) {
            this.found();
        }
    }

    public visitBooleanValue(booleanValue: BooleanValue): void {
        if (booleanValue === this.searchDescendent) {
            this.found();
        }
    }

    public visitNullValue(nullValue: NullValue): void {
        if (nullValue === this.searchDescendent) {
            this.found();
        }
    }

    public visitProperty(property: Property | undefined): void {
        if (!this._foundLineageValues && property) {
            if (property === this.searchDescendent) {
                this.found();
            } else {
                this._lineage.push(property);
                super.visitProperty(property);
                this._lineage.pop();
            }
        }
    }

    public visitObjectValue(objectValue: ObjectValue | undefined): void {
        if (!this._foundLineageValues && objectValue) {
            if (objectValue === this.searchDescendent) {
                this.found();
            } else {
                this._lineage.push(objectValue);
                super.visitObjectValue(objectValue);
                this._lineage.pop();
            }
        }
    }

    public visitArrayValue(arrayValue: ArrayValue | undefined): void {
        if (!this._foundLineageValues && arrayValue) {
            if (arrayValue === this.searchDescendent) {
                this.found();
            } else {
                this._lineage.push(arrayValue);
                super.visitArrayValue(arrayValue);
                this._lineage.pop();
            }
        }
    }

    private found(): void {
        this._foundLineageValues = this._lineage.slice();
    }

    public static visit(root: Value, find: Value): (ArrayValue | ObjectValue | Property)[] | undefined {
        const visitor = new FindJsonLineageVisitor(find);
        root.accept(visitor);
        return visitor._foundLineageValues;
    }
}
