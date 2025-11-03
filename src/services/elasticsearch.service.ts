import { Client } from '@elastic/elasticsearch';
import config from '../config';
import { logger } from '../utils/logger';

/**
 * Elasticsearch service for advanced search capabilities
 */
class ElasticsearchService {
  private client: Client;
  private readonly jobsIndex = 'jobs';
  private readonly applicantsIndex = 'applicants';
  private readonly companiesIndex = 'companies';
  public isConnected = false;

  constructor() {
    this.client = new Client({
      node: config.elasticsearch?.url || 'http://localhost:9200',
      auth: config.elasticsearch?.auth ? {
        username: config.elasticsearch.auth.username,
        password: config.elasticsearch.auth.password
      } : undefined
    });
    
    this.initialize();
  }

  /**
   * Initialize Elasticsearch connection and indices
   */
  private async initialize() {
    try {
      // Check connection
      const info = await this.client.info();
      logger.info(`Elasticsearch connected: ${info.name}`);
      this.isConnected = true;

      // Create indices if they don't exist
      await this.createIndicesIfNotExist();
    } catch (error) {
      logger.error(`Elasticsearch connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      this.isConnected = false;
    }
  }

  /**
   * Create necessary indices if they don't exist
   */
  private async createIndicesIfNotExist() {
    try {
      // Check if jobs index exists
      const jobsExists = await this.client.indices.exists({ index: this.jobsIndex });
      
      if (!jobsExists) {
        // Create jobs index with mapping
        await this.client.indices.create({
          index: this.jobsIndex,
          body: {
            mappings: {
              properties: {
                position: { type: 'text', analyzer: 'english' },
                company: { type: 'text', analyzer: 'english' },
                description: { type: 'text', analyzer: 'english' },
                requirements: { type: 'text', analyzer: 'english' },
                responsibilities: { type: 'text', analyzer: 'english' },
                location: {
                  properties: {
                    city: { type: 'text', fields: { keyword: { type: 'keyword' } } },
                    state: { type: 'text', fields: { keyword: { type: 'keyword' } } },
                    country: { type: 'text', fields: { keyword: { type: 'keyword' } } },
                    remote: { type: 'boolean' },
                    type: { type: 'keyword' }
                  }
                },
                salary: {
                  properties: {
                    min: { type: 'float' },
                    max: { type: 'float' },
                    currency: { type: 'keyword' },
                    period: { type: 'keyword' }
                  }
                },
                jobType: { type: 'keyword' },
                experience: { type: 'keyword' },
                categories: { type: 'keyword' },
                tags: { type: 'keyword' },
                createdAt: { type: 'date' },
                updatedAt: { type: 'date' }
              }
            }
          }
        });
        
        logger.info('Jobs index created');
      }

      // Check if applicants index exists
      const applicantsExists = await this.client.indices.exists({ index: this.applicantsIndex });
      
      if (!applicantsExists) {
        // Create applicants index with mapping
        await this.client.indices.create({
          index: this.applicantsIndex,
          body: {
            mappings: {
              properties: {
                headline: { type: 'text', analyzer: 'english' },
                summary: { type: 'text', analyzer: 'english' },
                skills: {
                  properties: {
                    name: { type: 'text', fields: { keyword: { type: 'keyword' } } },
                    level: { type: 'keyword' }
                  }
                },
                workExperience: {
                  properties: {
                    position: { type: 'text', analyzer: 'english' },
                    company: { type: 'text', analyzer: 'english' },
                    description: { type: 'text', analyzer: 'english' }
                  }
                },
                education: {
                  properties: {
                    institution: { type: 'text', analyzer: 'english' },
                    degree: { type: 'text', analyzer: 'english' },
                    field: { type: 'text', analyzer: 'english' }
                  }
                },
                preferredJobTypes: { type: 'keyword' },
                preferredLocations: { type: 'keyword' },
                preferredIndustries: { type: 'keyword' },
                isRemoteOnly: { type: 'boolean' }
              }
            }
          }
        });
        
        logger.info('Applicants index created');
      }

      // Check if companies index exists
      const companiesExists = await this.client.indices.exists({ index: this.companiesIndex });
      
      if (!companiesExists) {
        // Create companies index with mapping
        await this.client.indices.create({
          index: this.companiesIndex,
          body: {
            mappings: {
              properties: {
                name: { type: 'text', analyzer: 'english', fields: { keyword: { type: 'keyword' } } },
                description: { type: 'text', analyzer: 'english' },
                industry: { type: 'keyword' },
                location: {
                  properties: {
                    city: { type: 'text', fields: { keyword: { type: 'keyword' } } },
                    state: { type: 'text', fields: { keyword: { type: 'keyword' } } },
                    country: { type: 'text', fields: { keyword: { type: 'keyword' } } }
                  }
                },
                website: { type: 'keyword' },
                size: { type: 'keyword' },
                founded: { type: 'integer' },
                specialties: { type: 'keyword' }
              }
            }
          }
        });
        
        logger.info('Companies index created');
      }
    } catch (error) {
      logger.error(`Failed to create indices: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Index a job document
   * @param job Job document to index
   */
  async indexJob(job: any) {
    if (!this.isConnected) return;
    
    try {
      await this.client.index({
        index: this.jobsIndex,
        id: job._id.toString(),
        document: {
          position: job.position,
          company: job.company,
          description: job.description,
          location: job.location,
          salary: job.salary,
          jobType: job.jobType,
          experience: job.experience,
          requirements: job.requirements,
          responsibilities: job.responsibilities,
          categories: job.categories,
          tags: job.tags,
          createdAt: job.createdAt,
          updatedAt: job.updatedAt
        }
      });
    } catch (error) {
      logger.error(`Failed to index job: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Index an applicant document
   * @param applicant Applicant document to index
   */
  async indexApplicant(applicant: any) {
    if (!this.isConnected) return;
    
    try {
      await this.client.index({
        index: this.applicantsIndex,
        id: applicant._id.toString(),
        document: {
          headline: applicant.headline,
          summary: applicant.summary,
          skills: applicant.skills,
          workExperience: applicant.workExperience,
          education: applicant.education,
          preferredJobTypes: applicant.preferredJobTypes,
          preferredLocations: applicant.preferredLocations,
          preferredIndustries: applicant.preferredIndustries,
          isRemoteOnly: applicant.isRemoteOnly
        }
      });
    } catch (error) {
      logger.error(`Failed to index applicant: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Index a company document
   * @param company Company document to index
   */
  async indexCompany(company: any) {
    if (!this.isConnected) return;
    
    try {
      await this.client.index({
        index: this.companiesIndex,
        id: company._id.toString(),
        document: {
          name: company.name,
          description: company.description,
          industry: company.industry,
          location: company.location,
          website: company.website,
          size: company.size,
          founded: company.founded,
          specialties: company.specialties
        }
      });
    } catch (error) {
      logger.error(`Failed to index company: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Search for jobs
   * @param query Search query
   * @param filters Search filters
   * @param page Page number
   * @param limit Results per page
   */
  async searchJobs(query: string, filters: any = {}, page = 1, limit = 10) {
    if (!this.isConnected) {
      return { total: 0, jobs: [] };
    }
    
    try {
      const from = (page - 1) * limit;
      
      // Build search query
      const searchQuery: any = {
        bool: {
          must: [],
          filter: []
        }
      };
      
      // Add text search if query provided
      if (query) {
        searchQuery.bool.must.push({
          multi_match: {
            query,
            fields: ['position^3', 'company^2', 'description', 'requirements', 'responsibilities', 'categories', 'tags'],
            fuzziness: 'AUTO'
          }
        });
      }
      
      // Add filters
      if (filters.jobType) {
        searchQuery.bool.filter.push({
          term: { jobType: filters.jobType }
        });
      }
      
      if (filters.experience) {
        searchQuery.bool.filter.push({
          term: { experience: filters.experience }
        });
      }
      
      if (filters.remote === true) {
        searchQuery.bool.filter.push({
          term: { 'location.remote': true }
        });
      }
      
      if (filters.locationType) {
        searchQuery.bool.filter.push({
          term: { 'location.type': filters.locationType }
        });
      }
      
      if (filters.location) {
        searchQuery.bool.filter.push({
          bool: {
            should: [
              { match: { 'location.city': filters.location } },
              { match: { 'location.state': filters.location } },
              { match: { 'location.country': filters.location } }
            ]
          }
        });
      }
      
      if (filters.minSalary) {
        searchQuery.bool.filter.push({
          range: {
            'salary.min': { gte: filters.minSalary }
          }
        });
      }
      
      if (filters.maxSalary) {
        searchQuery.bool.filter.push({
          range: {
            'salary.max': { lte: filters.maxSalary }
          }
        });
      }
      
      if (filters.categories && filters.categories.length) {
        searchQuery.bool.filter.push({
          terms: { categories: filters.categories }
        });
      }
      
      // Execute search
      const result = await this.client.search({
        index: this.jobsIndex,
        body: {
          query: searchQuery,
          sort: [
            { _score: { order: 'desc' } },
            { createdAt: { order: 'desc' } }
          ],
          from,
          size: limit
        }
      });
      
      // Format results
      const total = result.hits.total as any;
      const jobs = result.hits.hits.map((hit: any) => ({
        id: hit._id,
        score: hit._score,
        ...hit._source
      }));
      
      return {
        total: total.value,
        jobs
      };
    } catch (error) {
      logger.error(`Job search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { total: 0, jobs: [] };
    }
  }

  /**
   * Search for applicants
   * @param query Search query
   * @param filters Search filters
   * @param page Page number
   * @param limit Results per page
   */
  async searchApplicants(query: string, filters: any = {}, page = 1, limit = 10) {
    if (!this.isConnected) {
      return { total: 0, applicants: [] };
    }
    
    try {
      const from = (page - 1) * limit;
      
      // Build search query
      const searchQuery: any = {
        bool: {
          must: [],
          filter: []
        }
      };
      
      // Add text search if query provided
      if (query) {
        searchQuery.bool.must.push({
          multi_match: {
            query,
            fields: ['headline^3', 'summary^2', 'skills.name^3', 'workExperience.position^2', 'workExperience.company', 'education.field'],
            fuzziness: 'AUTO'
          }
        });
      }
      
      // Add filters
      if (filters.skills && filters.skills.length) {
        searchQuery.bool.filter.push({
          terms: { 'skills.name.keyword': filters.skills }
        });
      }
      
      if (filters.jobTypes && filters.jobTypes.length) {
        searchQuery.bool.filter.push({
          terms: { preferredJobTypes: filters.jobTypes }
        });
      }
      
      if (filters.remote === true) {
        searchQuery.bool.filter.push({
          term: { isRemoteOnly: true }
        });
      }
      
      // Execute search
      const result = await this.client.search({
        index: this.applicantsIndex,
        body: {
          query: searchQuery,
          from,
          size: limit
        }
      });
      
      // Format results
      const total = result.hits.total as any;
      const applicants = result.hits.hits.map((hit: any) => ({
        id: hit._id,
        score: hit._score,
        ...hit._source
      }));
      
      return {
        total: total.value,
        applicants
      };
    } catch (error) {
      logger.error(`Applicant search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { total: 0, applicants: [] };
    }
  }

  /**
   * Get job recommendations for an applicant
   * @param applicantProfile Applicant profile
   * @param limit Number of recommendations to return
   */
  async getJobRecommendations(applicantProfile: any, limit = 10) {
    if (!this.isConnected) {
      return [];
    }
    
    try {
      // Extract skills and job titles
      const skills = applicantProfile.skills.map((skill: any) => skill.name);
      const jobTitles = applicantProfile.workExperience.map((exp: any) => exp.position);
      
      // Build search query
      const searchQuery: any = {
        bool: {
          should: [
            // Match skills
            {
              multi_match: {
                query: skills.join(' '),
                fields: ['requirements^3', 'description', 'responsibilities'],
                type: 'cross_fields',
                operator: 'or'
              }
            },
            // Match job titles
            {
              multi_match: {
                query: jobTitles.join(' '),
                fields: ['position^3'],
                type: 'best_fields',
                fuzziness: 'AUTO'
              }
            }
          ],
          filter: []
        }
      };
      
      // Add filters based on preferences
      if (applicantProfile.isRemoteOnly) {
        searchQuery.bool.filter.push({
          term: { 'location.remote': true }
        });
      }
      
      if (applicantProfile.preferredJobTypes && applicantProfile.preferredJobTypes.length) {
        searchQuery.bool.filter.push({
          terms: { jobType: applicantProfile.preferredJobTypes }
        });
      }
      
      // Execute search
      const result = await this.client.search({
        index: this.jobsIndex,
        body: {
          query: searchQuery,
          size: limit
        }
      });
      
      // Format results
      return result.hits.hits.map((hit: any) => ({
        id: hit._id,
        score: hit._score,
        ...hit._source
      }));
    } catch (error) {
      logger.error(`Job recommendations failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return [];
    }
  }

  /**
   * Get candidate recommendations for a job
   * @param jobId Job ID
   * @param limit Number of recommendations to return
   */
  async getCandidateRecommendations(job: any, limit = 10) {
    if (!this.isConnected) {
      return [];
    }
    
    try {
      // Extract requirements and responsibilities
      const requirements = job.requirements.join(' ');
      const responsibilities = job.responsibilities.join(' ');
      
      // Build search query
      const searchQuery: any = {
        bool: {
          should: [
            // Match skills with requirements
            {
              nested: {
                path: 'skills',
                query: {
                  multi_match: {
                    query: requirements,
                    fields: ['skills.name^3'],
                    type: 'best_fields'
                  }
                }
              }
            },
            // Match experience with job title and responsibilities
            {
              nested: {
                path: 'workExperience',
                query: {
                  multi_match: {
                    query: `${job.position} ${responsibilities}`,
                    fields: ['workExperience.position^3', 'workExperience.description'],
                    type: 'best_fields'
                  }
                }
              }
            }
          ],
          filter: []
        }
      };
      
      // Add filters based on job requirements
      if (job.location.remote === false) {
        searchQuery.bool.filter.push({
          term: { isRemoteOnly: false }
        });
      }
      
      // Execute search
      const result = await this.client.search({
        index: this.applicantsIndex,
        body: {
          query: searchQuery,
          size: limit
        }
      });
      
      // Format results
      return result.hits.hits.map((hit: any) => ({
        id: hit._id,
        score: hit._score,
        ...hit._source
      }));
    } catch (error) {
      logger.error(`Candidate recommendations failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return [];
    }
  }

  /**
   * Delete a document from an index
   * @param index Index name
   * @param id Document ID
   */
  async deleteDocument(index: string, id: string) {
    if (!this.isConnected) return;
    
    try {
      await this.client.delete({
        index,
        id
      });
    } catch (error) {
      logger.error(`Failed to delete document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a job document
   * @param jobId Job ID
   */
  async deleteJob(jobId: string) {
    return this.deleteDocument(this.jobsIndex, jobId);
  }

  /**
   * Delete an applicant document
   * @param applicantId Applicant ID
   */
  async deleteApplicant(applicantId: string) {
    return this.deleteDocument(this.applicantsIndex, applicantId);
  }

  /**
   * Delete a company document
   * @param companyId Company ID
   */
  async deleteCompany(companyId: string) {
    return this.deleteDocument(this.companiesIndex, companyId);
  }
}

export default new ElasticsearchService();

// Made with Bob
