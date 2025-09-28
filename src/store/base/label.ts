// base/label Store Module
// #110

// store
import { defineStore } from "pinia";

// types
import type { Label, LabelRef, LabelsDetail } from "@/types/base";



export interface BaseLabelState {
    labels: {
        [key: LabelRef]: Label
    },
    label_lists: {
        [key: string]: LabelRef[]
    }
}


export const useBaseLabelStore = defineStore('base/label', {
    unistorage: true,
    state: (): BaseLabelState => {
        return {
            labels: {},
            label_lists: {}
        }
    },
    getters: {
        label: (state) => {
            return (label_id: LabelRef): Label | null => state.labels[label_id] || null;
        },
        allLabels: (state) => {
            return Object.values(state.labels);
        },
        labelList(state) {
            return (list_id: string): Label[] | null => {
                const list = state.label_lists[list_id];
                if (!list) return null;
                return list.map((label_id) => this.label(label_id) as Label);
            }
        }
    },
    actions: {
        upsertLabel(label: Label) {
            this.labels[label._id] = label;
            return label._id;
        },
        upsertLabelsFromDetail(labels: LabelsDetail) {
            labels.map((label) => {
                this.upsertLabel(label);
            });
            return labels.map((label) => label._id);
        },
        upsertLabelListFromLabels(list_id: string, list: Label[]) {
            this.label_lists[list_id] = list.map((label) => {
                this.upsertLabel(label);
                return label._id
            });
        }
    }
})
