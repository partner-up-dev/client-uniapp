// base/requirement Store Module
// #110

// store
import { defineStore } from "pinia";

// types
import { RequirementType, type Requirement, type RequirementDetail, type RequirementRef } from "@/types/base";

// constant
import { DEFAULT_REQUIREMENT } from "@/data/default_data";
import { useBaseLabelStore } from "./label";



export interface BaseRequirementState {
    requirements: {
        [key: RequirementRef]: Requirement
    }
}


export const useBaseRequirementStore = defineStore('base/requirement', {
    unistorage: true,
    state: (): BaseRequirementState => {
        return {
            requirements: {}
        }
    },
    getters: {
        requirement(state: BaseRequirementState) {
            return (requirement_id: RequirementRef): Requirement | null => state.requirements[requirement_id] || null;
        },
    },
    actions: {
        async upsertRequirement(requirement: Requirement) {
            this.requirements[requirement._id] = requirement;
            return requirement._id;
        },
        async upsertRequirementsFromDetail(detail: RequirementDetail) {
            const requirement = this.requirements[detail._id] || DEFAULT_REQUIREMENT;

            if (requirement.type === RequirementType.Tag) {
                requirement.content = useBaseLabelStore().upsertLabel(detail.content);
            }

            this.upsertRequirement(requirement);
            return requirement._id;
        }
    }
})
