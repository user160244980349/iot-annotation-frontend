/**
 *
 *  - activities
 *   breach_activity
 *   policy_change_activity
 *   give_consent
 *   withdraw_consent
 * 
 * - agents
 *   user
 *   first_party
 *   third_party
 *   data_protection_officer
 * 
 * - notification mechanisms
 *   on_website
 *   via_postal_mail
 *   via_sms
 *   on_service
 *   via_phone_call
 *   in_privacy_policy
 *   via_email
 * 
 * - consequences
 *   remove_compromised_information
 *   compensation
 *   breach_investigation
 *   policy_change_consequence
 *   no_service_restriction
 *   service_partial_restriction
 *   service_full_restriction
 * 
 * - causes
 *   force_majeur
 *   intentional
 *   unintentional
 *   other
 *   privacy_related
 *   non_privacy_related
 *   marge_acquisition
 * 
 * 
 */

const META_LAYERS = [

    // ACTIVITIES
    {
        class: "breach_activity",
        subclassOf: ["activity"],
        attributeOf: [],
    },
    {
        class: "policy_change_activity",
        subclassOf: ["control_activity", "activity"],
        attributeOf: [],
    },
    {
        class: "give_consent",
        subclassOf: ["consent_activity", "control_activity", "activity"],
        attributeOf: [],
    },
    {
        class: "withdraw_consent",
        subclassOf: ["consent_activity", "control_activity", "activity"],
        attributeOf: [],
    },

    // AGENTS
    {
        class: "user",
        subclassOf: ["agent"],
        attributeOf: ["breach_activity", "give_consent", "withdraw_consent"],
    },
    {
        class: "first_party",
        subclassOf: ["agent"],
        attributeOf: ["breach_activity", "policy_change_activity"],
    },
    {
        class: "third_party",
        subclassOf: ["agent"],
        attributeOf: ["breach_activity"],
    },
    {
        class: "data_protection_officer",
        subclassOf: ["agent"],
        attributeOf: ["breach_activity"],
    },

    // MECHANISMS
    {
        class: "on_website",
        subclassOf: ["notification_mechanism", "mechanism"],
        attributeOf: ["breach_activity", "policy_change_activity"],
    },
    {
        class: "via_postal_mail",
        subclassOf: ["notification_mechanism", "mechanism"],
        attributeOf: ["breach_activity", "policy_change_activity"],
    },
    {
        class: "via_sms",
        subclassOf: ["notification_mechanism", "mechanism"],
        attributeOf: ["breach_activity", "policy_change_activity"],
    },
    {
        class: "on_service",
        subclassOf: ["notification_mechanism", "mechanism"],
        attributeOf: ["breach_activity", "policy_change_activity"],
    },
    {
        class: "via_phone_call",
        subclassOf: ["notification_mechanism", "mechanism"],
        attributeOf: ["breach_activity", "policy_change_activity"],
    },
    {
        class: "in_privacy_policy",
        subclassOf: ["notification_mechanism", "mechanism"],
        attributeOf: ["breach_activity", "policy_change_activity"],
    },
    {
        class: "via_email",
        subclassOf: ["notification_mechanism", "mechanism"],
        attributeOf: ["breach_activity", "policy_change_activity"],
    },

    // CONSEQUENCES
    {
        class: "remove_compromised_information",
        subclassOf: ["breach_consequence", "consequence"],
        attributeOf: ["breach_activity"],
    },
    {
        class: "compensation",
        subclassOf: ["breach_consequence", "consequence"],
        attributeOf: ["breach_activity"],
    },
    {
        class: "breach_investigation",
        subclassOf: ["breach_consequence", "consequence"],
        attributeOf: ["breach_activity"],
    },
    {
        class: "no_service_restriction",
        subclassOf: ["user_choice_consequence", "consequence"],
        attributeOf: ["give_consent", "withdraw_consent"],
    },
    {
        class: "service_partial_restriction",
        subclassOf: ["user_choice_consequence", "consequence"],
        attributeOf: ["give_consent", "withdraw_consent"],
    },
    {
        class: "service_full_restriction",
        subclassOf: ["user_choice_consequence", "consequence"],
        attributeOf: ["give_consent", "withdraw_consent"],
    },

    // CAUSES
    {
        class: "force_majeur",
        subclassOf: ["breach_cause", "cause"],
        attributeOf: ["breach_activity"],
    },
    {
        class: "intentional",
        subclassOf: ["breach_cause", "cause"],
        attributeOf: ["breach_activity"],
    },
    {
        class: "unintentional",
        subclassOf: ["breach_cause", "cause"],
        attributeOf: ["breach_activity"],
    },
    {
        class: "other",
        subclassOf: ["policy_change_cause", "cause"],
        attributeOf: ["policy_change_activity"],
    },
    {
        class: "privacy_related",
        subclassOf: ["policy_change_cause", "cause"],
        attributeOf: ["policy_change_activity"],
    },
    {
        class: "non_privacy_related",
        subclassOf: ["policy_change_cause", "cause"],
        attributeOf: ["policy_change_activity"],
    },
    {
        class: "marge_acquisition",
        subclassOf: ["policy_change_cause", "cause"],
        attributeOf: ["policy_change_activity"],
    },

    // USER CATEGORY
    {
        class: "user_special_category",
        subclassOf: ["category"],
        attributeOf: ["user"],
    },

    // POLICY SCOPE
    {
        class: "policy_scope_change",
        subclassOf: ["scope"],
        attributeOf: ["policy_change_activity"],
    },

    // TIME
    {
        class: "breach_investigation_time",
        subclassOf: ["time_period"],
        attributeOf: ["breach_investigation"],
    },
    {
        class: "policy_acceptance_time",
        subclassOf: ["time_period"],
        attributeOf: ["policy_scope_change"],
    },
]

export default META_LAYERS;